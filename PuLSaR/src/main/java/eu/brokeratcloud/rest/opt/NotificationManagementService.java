package eu.brokeratcloud.rest.opt;

import java.util.*;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import eu.brokeratcloud.opt.Notification;
import eu.brokeratcloud.opt.Recommendation;
import eu.brokeratcloud.opt.RecommendationItem;
import eu.brokeratcloud.persistence.RdfPersistenceManager;
import eu.brokeratcloud.persistence.RdfPersistenceManagerFactory;
import eu.brokeratcloud.persistence.SparqlServiceClient;
import eu.brokeratcloud.persistence.SparqlServiceClientFactory;

import com.hp.hpl.jena.rdf.model.RDFNode;

@Path("/opt/notification")
public class NotificationManagementService extends AbstractManagementService {

	// GET /opt/notification/sd/{sdId}/period/{period-spec}/list
	// Description: Get a list of notifications for the specified service description in the specified period
	@GET
	@Path("/sd/{sdId}/period/{period_spec}/list")
	@Produces("application/json")
	public Notification[] getServiceNotificationsForPeriod(@PathParam("sdId") String sdId, @PathParam("period_spec") String period) {
		logger.debug("getServiceNotificationsForPeriod: calculating time limit from period = {}", period);
		long diff = Long.parseLong(period);
		Date limitTm = new Date( System.currentTimeMillis() - diff );
		//
		logger.debug("getServiceNotificationsForPeriod: Calling getServiceNotifications with the same parameters: service = {}", sdId);
		Notification[] notifArr = getServiceNotifications(sdId);
		logger.debug("getServiceNotificationsForPeriod: Filtering retrieved notifications using period: {}", period);
		int cnt = 0;
		for (int i=0; i<notifArr.length; i++) {
			if (notifArr[i].getCreateTimestamp()==null) notifArr[i] = null;		// No create-timestamp means 01/01/1900, therefore this recommendation is NOT included
			else if (notifArr[i].getCreateTimestamp().getTime()<limitTm.getTime()) notifArr[i] = null;
			else cnt++;
		}
		Notification[] notifArr2 = new Notification[cnt];
		for (int i=0, j=0; i<notifArr.length; i++) {
			if (notifArr[i]!=null) notifArr2[j++] = notifArr[i];
		}
		return notifArr2;
	}

	// GET /opt/notification/sd/{sdId}
	// Description: Gets a notifications list for the specified service description
	@GET
	@Path("/sd/{sdId}")
	@Produces("application/json")
	public Notification[] getServiceNotifications(@PathParam("sdId") String sdId) {
		try {
			// Prepare query
			String sdIdDec = java.net.URLDecoder.decode(sdId);
			
			String queryStr = 
				"SELECT ?tm ?srvName ?profileId ?profileName ?owner ?it_id ?it_response ?it_weight \n"+
				"WHERE { \n"+
				"	BIND ( <%s> as ?srv ) .\n"+
				"	BIND ( str(?srv) as ?srvUri1 ) .\n"+
				"	?recom a <http://www.linked-usdl.org/ns/usdl-pref#Recommendation> .\n"+
				"	?recom ?hasItem ?it .\n"+
				"	FILTER regex(str(?hasItem),'^http://www.brokeratcloud.eu/v1/opt/RECOMMENDATION/items:_','') .\n"+
				"	?it <http://www.brokeratcloud.eu/v1/opt/RECOMMENDATION-ITEM/serviceDescription> ?srvUri2 .\n"+
				"	FILTER ( ?srvUri1 = ?srvUri2 ) .\n"+
				"	?recom <http://purl.org/dc/terms/created> ?tm .\n"+
				"	?recom <http://www.brokeratcloud.eu/v1/opt/RECOMMENDATION/profile> ?profileId .\n"+
				"	?profile <http://purl.org/dc/terms/identifier> ?profileId .\n"+
				"	?profile <http://purl.org/dc/terms/title> ?profileName .\n"+
				"	?recom <http://purl.org/dc/terms/creator> ?owner .\n"+
				"	?it <http://purl.org/dc/terms/identifier> ?it_id .\n"+
				"	?it <http://www.brokeratcloud.eu/v1/opt/RECOMMENDATION-ITEM/response> ?it_response .\n"+
				"	?it <http://www.brokeratcloud.eu/v1/opt/RECOMMENDATION-ITEM/weight> ?it_weight .\n"+
				"	?srv <http://purl.org/dc/terms/title> ?srvName .\n"+
				"} \n"+
				"ORDER BY ?tm\n";
			
			// Query repository
			logger.debug("getServiceNotifications: Retrieving Notifications for service description = {}", sdIdDec);
			String query = String.format(queryStr, sdIdDec);
			logger.trace("getServiceNotifications: Query = \n{}", query);
			
			SparqlServiceClient client = SparqlServiceClientFactory.getClientInstance();
			List<Map<String,RDFNode>> results = client.queryAndProcess( query );
			
			// Extract needed data from query results and prepare notifications
			List<Notification> notifList = new ArrayList<Notification>();
			if (results!=null && results.size()>0) {
				logger.debug("getServiceNotifications: {} notifications found", results.size());
				for (Map<String,RDFNode> soln : results) {
					// Extract data
					String tmStr = soln.get("tm").asLiteral().getString();
					String srvName = soln.get("srvName").asLiteral().getString();
					String profileId = soln.get("profileId").asLiteral().getString();
					String profileName = soln.get("profileName").asLiteral().getString();
					String owner = soln.get("owner").asLiteral().getString();
					String itId = soln.get("it_id").asLiteral().getString();
					String itResponse = soln.get("it_response").asLiteral().getString();
					double itWeight = soln.get("it_weight").asLiteral().getDouble();
					
					Date tm = parseW3CDateTime(tmStr);
					
					int rank = -1;
					int p = itId.lastIndexOf("-");
					if (p>=0 && p+1<itId.length()) {
						try { 
							rank = Integer.parseInt( itId.substring(p+1) );
							rank++;
						} catch (NumberFormatException e) {
							logger.error("getServiceNotifications: EXCEPTION while extracting recom. item's rank from id: recom-item-id={}", itId);
						}
					}
					
					logger.trace("getServiceNotifications:\t\tNotification: tm={}, service={}, profile-id={}, profile-name={}, owner={}, item-id={}, response={}, suggestion={}, weight={}",  tm, srvName, profileId, profileName, owner, itId, itResponse, itWeight);
					
					// Prepare notification message
					String mesg = String.format("Service <i>'%s'</i> has been ranked <b>#%d</b> (score: %3.2f%%) for consumer <i>%s</i>'s preference profile <i>'%s'</i>", srvName, rank, 100*itWeight, owner, profileName);
					if (!itResponse.equalsIgnoreCase("UNKNOWN")) mesg += String.format(". Consumer has responded <b>'%s'</b>", itResponse);
					
					// Prepare notification object
					Notification notif = new Notification();
					notif.setCreateTimestamp( tm );
					notif.setService( sdId );
					notif.setMessage( mesg );
					
					notifList.add(notif);
				}
			} else {
				logger.debug("getServiceNotifications: No notifications found");
			}
			
			Collections.reverse(notifList);
			return notifList.toArray(new Notification[0]);
		} catch (Exception e) {
			logger.error("getServiceNotifications: EXCEPTION THROWN: {}", e);
			logger.debug("getServiceNotifications: Returning an empty array of {}", Notification.class);
			return new Notification[0];
		}
	}
    
	protected static Date parseW3CDateTime(String tmStr) throws java.text.ParseException {
		if (tmStr.endsWith("Z")) tmStr = tmStr.substring(0, tmStr.length()-1) + "+00:00";

		int secFrac = tmStr.indexOf(",");
		if (secFrac==-1) secFrac = tmStr.indexOf(".");
		if (secFrac>=0) {
			int tzdIndex = tmStr.indexOf("+", secFrac);
			if (tzdIndex==-1) tzdIndex = tmStr.indexOf("-", secFrac);
			if (tzdIndex>=0) {
				tmStr = tmStr.substring(0,secFrac) + tmStr.substring(tzdIndex);
			} else {
				tmStr = tmStr.substring(0,secFrac);
			}
		}

		java.text.DateFormat df = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssX");
		return df.parse(tmStr);
	}
}
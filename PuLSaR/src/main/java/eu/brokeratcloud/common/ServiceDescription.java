/*
 * #%L
 * Preference-based cLoud Service Recommender (PuLSaR) - Broker@Cloud optimisation engine
 * %%
 * Copyright (C) 2014 - 2016 Information Management Unit, Institute of Communication and Computer Systems, National Technical University of Athens
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
package eu.brokeratcloud.common;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import eu.brokeratcloud.persistence.annotations.*;
import javax.xml.bind.annotation.XmlAttribute;
import org.codehaus.jackson.annotate.JsonIgnore;

@RdfSubject(
	rdfType="http://www.linked-usdl.org/ns/usdl-core#Service"
)
public class ServiceDescription extends BrokerObject {
	@XmlAttribute
	@RdfPredicate
	protected String serviceName;
	@XmlAttribute
	@RdfPredicate
	protected String serviceCategory;
	@XmlAttribute
	@RdfPredicate
	protected Map<String,Object> serviceAttributes;
	// Used in consumer feedback component 
	// NOT persisted in RDF repository
	@XmlAttribute
	protected Date lastUsedTimestamp;
	// Used in recommendation component 
	// NOT persisted in RDF repository
	@XmlAttribute
	protected String serviceModelUri;
	
	public ServiceDescription() { serviceAttributes = new HashMap<String,Object>(); }
	
	public String getServiceName() { return serviceName; }
	public void setServiceName(String s) { serviceName = s; }
	public String getServiceCategory() { return serviceCategory; }
	public void setServiceCategory(String s) { serviceCategory = s; }
	public Map<String,Object> getServiceAttributes() { return new HashMap<String,Object>(serviceAttributes); }
	public void setServiceAttributes(Map<String,Object> m) { serviceAttributes = m; }
	
	@JsonIgnore
	public Object getServiceAttributeValue(String attrId) {
		return serviceAttributes.get(attrId);
	}
	@JsonIgnore
	public void setServiceAttributeValue(String attrId, Object attrVal) {
		serviceAttributes.put(attrId, attrVal);
	}
	@JsonIgnore
	public void removeServiceAttribute(String attrId) {
		serviceAttributes.remove(attrId);
	}
	
	public Date getLastUsedTimestamp() { return lastUsedTimestamp; }
	public void setLastUsedTimestamp(Date d) { lastUsedTimestamp = d; }
	public String getServiceModelUri() { return serviceModelUri; }
	public void setServiceModelUri(String s) { serviceModelUri = s; }
	
	public String toString() {
		return "ServiceDescription: {\n"+super.toString()+
				"\tservice-name = "+serviceName+
				"\n\tcategory = "+serviceCategory+
				"\n\tattributes = "+serviceAttributes+
				"\n\tlast used timestamp = "+lastUsedTimestamp+
				"\n\tsm-uri = "+serviceModelUri+
				"}\n";
	}
}

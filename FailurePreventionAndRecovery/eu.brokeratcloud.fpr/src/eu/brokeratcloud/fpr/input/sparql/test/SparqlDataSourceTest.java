package eu.brokeratcloud.fpr.input.sparql.test;

import static org.junit.Assert.*;

import java.util.Collection;
import java.util.List;

import org.junit.Test;

import eu.brokeratcloud.fpr.input.sparql.ServiceAttributeSparql;
import eu.brokeratcloud.fpr.input.sparql.ServiceCategorySparql;
import eu.brokeratcloud.fpr.input.sparql.ServiceDependencySparql;
import eu.brokeratcloud.fpr.input.sparql.SparqlQuery;

public class SparqlDataSourceTest {

	@Test
	public void testCategoryAndService() {
		SparqlQuery.INSTANCE.setServer("http://netserv.seerc.org:3030/BrokerAtCloud/query");
		ServiceCategorySparql sc = new ServiceCategorySparql();

		List<String> cates = sc.getCategories();
		assertEquals(15, cates.size());
		assertTrue(cates.get(0).startsWith("http://www.broker-cloud.eu/service-descriptions/CAS/categories"));

		List<String> services = sc
				.getServices("http://www.broker-cloud.eu/service-descriptions/CAS/categories#contacts");
		assertEquals(1, services.size());
		assertEquals("http://www.broker-cloud.eu/service-descriptions/CAS/service-provider#CASAddressApp",
				services.get(0));

		List<String> services2 = sc.getServices("fc:insurance");
		assertEquals(services, services2);

		List<String> services3 = sc
				.getServices("http://www.broker-cloud.eu/service-descriptions/CAS/categories#branches");
		assertTrue(services3.isEmpty());
	}

	@Test
	public void testServiceAvailability() {
		ServiceAttributeSparql sa = new ServiceAttributeSparql();
		Object s = sa.get("sp:CASAddressApp", "availability");
		assertEquals("99", s);

		Object price = sa.get("sp:CASAddressApp", "gr:hasPriceSpecification");
		assertEquals("4.99", price);

		Object response = sa.get("sp:CASAddressApp", "cas:hasMinimumResponseTime");
		assertEquals("800", response);
	}

	@Test
	public void testServiceDependency() {
		ServiceDependencySparql sd = new ServiceDependencySparql();
		Collection s = (Collection) sd.getDependency("sp:CASAddressApp");
		assertEquals(1, s.size());
	}

}

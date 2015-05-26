package diva.brokeratcloud.fpr.input.abstracts;

import java.util.Collection;

import diva.brokeratcloud.fpr.input.json.ConsumerProfileJson;
import diva.brokeratcloud.fpr.input.local.ConsumerProfileLocal;

public abstract class ConsumerProfile {

	public static ConsumerProfile INSTANCE = new ConsumerProfileJson();
	
	public ConsumerProfile() {
		super();
	}

	public abstract Collection<String> getCurrentServices(String consumerProfile);

	public abstract Collection<String> getCurrentServices(String consumer, String profile);

	protected abstract String combineIds(String consumer, String profile);

	public abstract Object getRequired(String consumer, String profile);

}
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

import eu.brokeratcloud.persistence.annotations.*;

@RdfSubject(
	appendName=false,
	rdfType="http://www.linked-usdl.org/ns/usdl-core/cloud-broker#ClassificationDimension"
)
public class ClassificationDimension extends RootObject {
	@Id
	@RdfPredicate(dontSerialize=true)
	protected String id;
	@RdfPredicate(uri="http://purl.org/dc/terms/title", omitIfNull=true)
	protected String title;
	@RdfPredicate(uri="http://www.w3.org/2004/02/skos/core#prefLabel", lang="en", omitIfNull=true)
	protected String prefLabel;
	@RdfPredicate(uri="http://www.w3.org/2004/02/skos/core#altLabel", lang="de", omitIfNull=true)
	protected String altLabel;
	@RdfPredicate(uri="http://www.w3.org/2004/02/skos/core#broader", update="no-cascade", delete="no-cascade", omitIfNull=true)
	protected ClassificationDimension parent;
	@RdfPredicate(uri="http://www.w3.org/2004/02/skos/core#topConceptOf", update="no-cascade", delete="no-cascade", omitIfNull=true)
	protected ClassificationDimensionScheme topConceptOf;
	@RdfPredicate(uri="http://www.w3.org/2004/02/skos/core#inScheme", update="no-cascade", delete="no-cascade", omitIfNull=true)
	protected ClassificationDimensionScheme inScheme;
	
	public String getId() { return id; }
	public void setId(String s) { id = s; }
	public String getTitle() { return title; }
	public void setTitle(String s) { title = s; }
	public String getPrefLabel() { return prefLabel; }
	public void setPrefLabel(String s) { prefLabel = s; }
	public String getAltLabel() { return altLabel; }
	public void setAltLabel(String s) { altLabel = s; }
	public ClassificationDimension getParent() { return parent; }
	public void setParent(ClassificationDimension p) { parent = p; if (parent!=null) { topConceptOf = null; inScheme = parent.getInScheme(); } }
	public ClassificationDimensionScheme getTopConceptOf() { return topConceptOf; }
	public void setTopConceptOf(ClassificationDimensionScheme p) { topConceptOf = p; }
	public ClassificationDimensionScheme getInScheme() { return inScheme; }
	public void setInScheme(ClassificationDimensionScheme p) { inScheme = p; }

	//Workaround to avoid exceptions when encountering 'skos:narrower' property
	@RdfPredicate(isUri=true,uri="http://www.w3.org/2004/02/skos/core#narrower", update="no-cascade", delete="no-cascade", omitIfNull=true)
	protected String children;
	public String getChildren() { return children; }
	public void setChildren(String s) { children = s; }
	
	public String toString() {
		return "ClassificationDimension: {\n\tid = "+id+"\n\ttitle = "+title+
				"\n\tpref-label = "+prefLabel+"\n\talt-label = "+altLabel+
				"\n\tparent = "+(parent!=null ? (parent.getId()!=null?parent.getId():parent.toString()) : null)+
				"\n\ttop-concept-of = "+topConceptOf+(topConceptOf==null?"\n":"")+
				"\tin-scheme = "+inScheme+
				"\n}\n";
	}
}

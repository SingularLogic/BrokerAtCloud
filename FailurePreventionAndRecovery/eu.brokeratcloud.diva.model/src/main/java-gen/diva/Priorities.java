/**
 * Copyright 2014 SINTEF <brice.morin@sintef.no>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package diva;

import org.eclipse.emf.common.util.EList;

import diva.visitors.Visitable;
import diva.visitors.Visitor;

/**
 * <!-- begin-user-doc --> A representation of the model object '
 * <em><b>Priorities</b></em>'. <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * <ul>
 * <li>{@link diva.Priorities#getPriority <em>Priority</em>}</li>
 * </ul>
 * </p>
 *
 * @see diva.DivaPackage#getPriorities()
 * @model
 * @generated
 */
public interface Priorities extends Visitable {
	/**
	 * Returns the value of the '<em><b>Priority</b></em>' containment reference
	 * list. The list contents are of type {@link diva.Priority}. <!--
	 * begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Priority</em>' containment reference list
	 * isn't clear, there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * 
	 * @return the value of the '<em>Priority</em>' containment reference list.
	 * @see diva.DivaPackage#getPriorities_Priority()
	 * @model containment="true"
	 * @generated
	 */
	EList<Priority> getPriority();

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @model annotation=
	 *        "http://www.eclipse.org/emf/2002/GenModel body='return visitor.visitPriorities(this, context);'"
	 *        annotation=
	 *        "kermeta body='do\nresult := visitor.visitPriorities(self, context)\nend' isAbstract='false'"
	 * @generated
	 */
	<C, R> R accept(Visitor<C, R> visitor, C context);

} // Priorities

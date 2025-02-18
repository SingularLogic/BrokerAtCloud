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

import diva.visitors.Visitor;

/**
 * <!-- begin-user-doc --> A representation of the model object '
 * <em><b>Enum Variable Value</b></em>'. <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * <ul>
 * <li>{@link diva.EnumVariableValue#getLiteral <em>Literal</em>}</li>
 * </ul>
 * </p>
 *
 * @see diva.DivaPackage#getEnumVariableValue()
 * @model
 * @generated
 */
public interface EnumVariableValue extends VariableValue {
	/**
	 * Returns the value of the '<em><b>Literal</b></em>' reference. <!--
	 * begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Literal</em>' reference isn't clear, there
	 * really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * 
	 * @return the value of the '<em>Literal</em>' reference.
	 * @see #setLiteral(EnumLiteral)
	 * @see diva.DivaPackage#getEnumVariableValue_Literal()
	 * @model required="true"
	 * @generated
	 */
	EnumLiteral getLiteral();

	/**
	 * Sets the value of the '{@link diva.EnumVariableValue#getLiteral
	 * <em>Literal</em>}' reference. <!-- begin-user-doc --> <!-- end-user-doc
	 * -->
	 * 
	 * @param value
	 *            the new value of the '<em>Literal</em>' reference.
	 * @see #getLiteral()
	 * @generated
	 */
	void setLiteral(EnumLiteral value);

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @model annotation=
	 *        "http://www.eclipse.org/emf/2002/GenModel body='return visitor.visitEnumVariableValue(this, context);'"
	 *        annotation=
	 *        "kermeta body='do\nresult := visitor.visitEnumVariableValue(self, context)\nend' isAbstract='false'"
	 * @generated
	 */
	<C, R> R accept(Visitor<C, R> visitor, C context);

} // EnumVariableValue

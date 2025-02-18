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
package diva.impl;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.emf.common.notify.Notification;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.impl.ENotificationImpl;

import diva.BoolVariableValue;
import diva.BooleanVariable;
import diva.CEPable;
import diva.DivaFactory;
import diva.DivaPackage;
import diva.VariableValue;
import diva.visitors.Visitor;

/**
 * <!-- begin-user-doc --> An implementation of the model object '
 * <em><b>Boolean Variable</b></em>'. <!-- end-user-doc -->
 * <p>
 * The following features are implemented:
 * <ul>
 * <li>{@link diva.impl.BooleanVariableImpl#getQuery <em>Query</em>}</li>
 * </ul>
 * </p>
 *
 * @generated
 */
public class BooleanVariableImpl extends VariableImpl implements BooleanVariable {
	/**
	 * The default value of the '{@link #getQuery() <em>Query</em>}' attribute.
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @see #getQuery()
	 * @generated
	 * @ordered
	 */
	protected static final String QUERY_EDEFAULT = null;
	/**
	 * The cached value of the '{@link #getQuery() <em>Query</em>}' attribute.
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @see #getQuery()
	 * @generated
	 * @ordered
	 */
	protected String query = QUERY_EDEFAULT;

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	protected BooleanVariableImpl() {
		super();
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	@Override
	protected EClass eStaticClass() {
		return DivaPackage.Literals.BOOLEAN_VARIABLE;
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	public String getQuery() {
		return query;
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	public void setQuery(String newQuery) {
		String oldQuery = query;
		query = newQuery;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, DivaPackage.BOOLEAN_VARIABLE__QUERY, oldQuery,
					query));
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	public <C, R> R accept(final Visitor<C, R> visitor, final C context) {
		return visitor.visitBooleanVariable(this, context);
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	@Override
	public Object eGet(int featureID, boolean resolve, boolean coreType) {
		switch (featureID) {
		case DivaPackage.BOOLEAN_VARIABLE__QUERY:
			return getQuery();
		}
		return super.eGet(featureID, resolve, coreType);
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	@Override
	public void eSet(int featureID, Object newValue) {
		switch (featureID) {
		case DivaPackage.BOOLEAN_VARIABLE__QUERY:
			setQuery((String) newValue);
			return;
		}
		super.eSet(featureID, newValue);
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	@Override
	public void eUnset(int featureID) {
		switch (featureID) {
		case DivaPackage.BOOLEAN_VARIABLE__QUERY:
			setQuery(QUERY_EDEFAULT);
			return;
		}
		super.eUnset(featureID);
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	@Override
	public boolean eIsSet(int featureID) {
		switch (featureID) {
		case DivaPackage.BOOLEAN_VARIABLE__QUERY:
			return QUERY_EDEFAULT == null ? query != null : !QUERY_EDEFAULT.equals(query);
		}
		return super.eIsSet(featureID);
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	@Override
	public int eBaseStructuralFeatureID(int derivedFeatureID, Class<?> baseClass) {
		if (baseClass == CEPable.class) {
			switch (derivedFeatureID) {
			case DivaPackage.BOOLEAN_VARIABLE__QUERY:
				return DivaPackage.CE_PABLE__QUERY;
			default:
				return -1;
			}
		}
		return super.eBaseStructuralFeatureID(derivedFeatureID, baseClass);
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	@Override
	public int eDerivedStructuralFeatureID(int baseFeatureID, Class<?> baseClass) {
		if (baseClass == CEPable.class) {
			switch (baseFeatureID) {
			case DivaPackage.CE_PABLE__QUERY:
				return DivaPackage.BOOLEAN_VARIABLE__QUERY;
			default:
				return -1;
			}
		}
		return super.eDerivedStructuralFeatureID(baseFeatureID, baseClass);
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	@Override
	public String toString() {
		if (eIsProxy())
			return super.toString();

		StringBuffer result = new StringBuffer(super.toString());
		result.append(" (query: ");
		result.append(query);
		result.append(')');
		return result.toString();
	}

	/**
	 * @generated NOT
	 */
	public void toAlloy(StringBuilder builder) {
		builder.append("lone sig " + getId() + " extends Context {}\n");
	}

	/**
	 * @generaed NOT
	 */
	@Override
	public List<VariableValue> allValue() {
		List<VariableValue> vals = new ArrayList<VariableValue>();

		BoolVariableValue bvv = DivaFactory.eINSTANCE.createBoolVariableValue();
		bvv.setBool(true);
		bvv.setVariable(this);

		BoolVariableValue bvv2 = DivaFactory.eINSTANCE.createBoolVariableValue();
		bvv2.setBool(false);
		bvv2.setVariable(this);

		vals.add(bvv);
		vals.add(bvv2);

		return vals;
	}

} // BooleanVariableImpl

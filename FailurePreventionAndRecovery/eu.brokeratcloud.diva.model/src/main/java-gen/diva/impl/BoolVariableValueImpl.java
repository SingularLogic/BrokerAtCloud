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

import org.eclipse.emf.common.notify.Notification;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.impl.ENotificationImpl;

import diva.BoolVariableValue;
import diva.DivaPackage;
import diva.VariableValue;
import diva.visitors.Visitor;

/**
 * <!-- begin-user-doc --> An implementation of the model object '
 * <em><b>Bool Variable Value</b></em>'. <!-- end-user-doc -->
 * <p>
 * The following features are implemented:
 * <ul>
 * <li>{@link diva.impl.BoolVariableValueImpl#isBool <em>Bool</em>}</li>
 * </ul>
 * </p>
 *
 * @generated
 */
public class BoolVariableValueImpl extends VariableValueImpl implements BoolVariableValue {
	/**
	 * The default value of the '{@link #isBool() <em>Bool</em>}' attribute.
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @see #isBool()
	 * @generated
	 * @ordered
	 */
	protected static final boolean BOOL_EDEFAULT = false;

	/**
	 * The cached value of the '{@link #isBool() <em>Bool</em>}' attribute. <!--
	 * begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @see #isBool()
	 * @generated
	 * @ordered
	 */
	protected boolean bool = BOOL_EDEFAULT;

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	protected BoolVariableValueImpl() {
		super();
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	@Override
	protected EClass eStaticClass() {
		return DivaPackage.Literals.BOOL_VARIABLE_VALUE;
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	public boolean isBool() {
		return bool;
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	public void setBool(boolean newBool) {
		boolean oldBool = bool;
		bool = newBool;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, DivaPackage.BOOL_VARIABLE_VALUE__BOOL, oldBool,
					bool));
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	public <C, R> R accept(final Visitor<C, R> visitor, final C context) {
		return visitor.visitBoolVariableValue(this, context);
	}

	/**
	 * <!-- begin-user-doc --> <!-- end-user-doc -->
	 * 
	 * @generated
	 */
	@Override
	public Object eGet(int featureID, boolean resolve, boolean coreType) {
		switch (featureID) {
		case DivaPackage.BOOL_VARIABLE_VALUE__BOOL:
			return isBool();
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
		case DivaPackage.BOOL_VARIABLE_VALUE__BOOL:
			setBool((Boolean) newValue);
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
		case DivaPackage.BOOL_VARIABLE_VALUE__BOOL:
			setBool(BOOL_EDEFAULT);
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
		case DivaPackage.BOOL_VARIABLE_VALUE__BOOL:
			return bool != BOOL_EDEFAULT;
		}
		return super.eIsSet(featureID);
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
		result.append(" (bool: ");
		result.append(bool);
		result.append(')');
		return result.toString();
	}

	/**
	 * @generated NOT
	 */
	public void toAlloy(StringBuilder builder) {
		if (bool)
			builder.append("one ");
		else
			builder.append("no ");
		builder.append(getVariable().getId());
	}

	@Override
	/**
	 * @generated NOT
	 */
	public boolean hasSameValue(VariableValue vv) {
		if (vv instanceof BoolVariableValue) {
			return ((BoolVariableValue) vv).isBool() == isBool();
		}
		return false;
	}

} // BoolVariableValueImpl

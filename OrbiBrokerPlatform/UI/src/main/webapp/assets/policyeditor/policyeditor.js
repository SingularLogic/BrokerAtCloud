var checkboxStatic = "<div class='checkbox'><label><input type='checkbox' value=''></label></div>";

var kb;

function storeBP() {
    var kb_bp = $.rdf()
            .base(document.getElementById("bp_namespace").value)
            .prefix('foaf', 'http://xmlns.com/foaf/0.1/')
            .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
            .prefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#')
            .prefix('owl', 'http://www.w3.org/2002/07/owl#')
            .prefix('dcterms', 'http://purl.org/dc/terms/')
            .prefix('usdl-core', 'http://www.linked-usdl.org/ns/usdl-core#')
            .prefix('usdl-core-cb', 'http://www.linked-usdl.org/ns/usdl-core/cloud-broker#')
            .prefix('usdl-sla', 'http://www.linked-usdl.org/ns/usdl-sla#')
            .prefix('usdl-sla-cb', 'http://www.linked-usdl.org/ns/usdl-core/cloud-broker-sla#')
            .prefix('usdl-pref', 'http://www.linked-usdl.org/ns/usdl-pref#')
            .prefix('usdl-business-roles', 'http://www.linked-usdl.org/ns/usdl-business-roles#')
            .prefix('blueprint', 'http://bizweb.sap.com/TR/blueprint#')
            .prefix('vcard', 'http://www.w3.org/2006/vcard/ns#')
            .prefix('xsd', 'http://www.w3.org/2001/XMLSchema#')
            .prefix('ctag', 'http://commontag.org/ns#')
            .prefix('org', 'http://www.w3.org/ns/org#')
            .prefix('skos', 'http://www.w3.org/2004/02/skos/core#')
            .prefix('time', 'http://www.w3.org/2006/time#')
            .prefix('gr', 'http://purl.org/goodrelations/v1#')
            .prefix('doap', 'http://usefulinc.com/ns/doap#')
            .prefix(document.getElementById("classtaxpref").value, document.getElementById("classtaxURI").value + "#")
            .prefix('bp', document.getElementById("bp_namespace").value + "#")
            //  .prefix('bp', document.kb.databank.baseURI)
            // Create the business entity of broker
            //.add("<" + document.getElementById("bp_business_entity").value + "> a gr:BusinessEntity .")
            .add("bp:" + document.getElementById("bp_business_entity").value + " a gr:BusinessEntity .")

            .add("bp:" + document.getElementById("bp_business_entity").value + ' gr:legalName ' + '"' + document.getElementById("bp_legal_name").value + '"^^xsd:string .')
            // Create the entity involvement instance and bind it to the broker business entity
            .add("bp:" + document.getElementById("bp_business_entity").value + "EntityInvolvement" + " a usdl-core:EntityInvolvement .")
            .add("bp:" + document.getElementById("bp_business_entity").value + "EntityInvolvement" + " usdl-core:withBusinessRole usdl-business-roles:intermediary .")
            .add("bp:" + document.getElementById("bp_business_entity").value + "EntityInvolvement" + " usdl-core:ofBusinessEntity " + "bp:" + document.getElementById("bp_business_entity").value + " .")
            // Create the business policy instance
            .add("bp:" + document.getElementById("bp_instance").value + " a " + "bp:" + document.getElementById("bp_model").value + " .")
            .add("bp:" + document.getElementById("bp_instance").value + " dcterms:creator " + "bp:" + document.getElementById("bp_business_entity").value + " .")
            .add("bp:" + document.getElementById("bp_instance").value + " usdl-core:hasEntityInvolvement " + "bp:" + document.getElementById("bp_business_entity").value + "EntityInvolvement .")
            .add("bp:" + document.getElementById("bp_instance").value + " usdl-core-cb:hasClassificationDimension " + document.getElementById("classtaxpref").value + ":" + document.getElementById("classtaxroot").value + " .")
            // Create the bp service model
            .add("bp:" + document.getElementById("bp_model").value + " rdfs:subClassOf usdl-core:ServiceModel .")


            // Create the SL profile
            .add("bp:" + document.getElementById("slp_class").value + " rdfs:subClassOf usdl-sla:ServiceLevelProfile .")
            .add("bp:" + "has" + document.getElementById("slp_class").value + " rdfs:subPropertyOf usdl-sla:hasServiceLevelProfile .")
            .add("bp:" + "has" + document.getElementById("slp_class").value + " rdfs:domain " + "bp:" + document.getElementById("bp_model").value + " .")
            .add("bp:" + "has" + document.getElementById("slp_class").value + " rdfs:range " + "bp:" + document.getElementById("slp_class").value + " .");

    //Broker policy lifecycle management 
    //Create validFrom and valid through
    kb_bp.add("bp:" + document.getElementById("bp_instance").value + ' usdl-core-cb:validFrom ' + '"' + document.getElementById("valid_from").value + '"^^xsd:date .')
    if (document.getElementById("valid_through").value != "") {
        kb_bp.add("bp:" + document.getElementById("bp_instance").value + ' usdl-core-cb:validThrough ' + '"' + document.getElementById("valid_through").value + '"^^xsd:date .')
    }
    // Create successor of and deprecation properties, if any.
    // Deprecation properties will not be created if there is no successor of even if values are provided!
    if (document.getElementById("successor_of_bp").value != "") {
        kb_bp.add("bp:" + document.getElementById("bp_instance").value + " gr:successorOf <" + document.getElementById("successor_of_bp").value + "> .");
        if (document.getElementById("onboarding_deprecated_from").value != "") {
            kb_bp.add("bp:" + document.getElementById("bp_instance").value + ' usdl-core-cb:deprecationOnboardingTimePoint ' + '"' + document.getElementById("onboarding_deprecated_from").value + '"^^xsd:date .');
        }
        if (document.getElementById("recommendation_deprecated_from").value != "") {
            kb_bp.add("bp:" + document.getElementById("bp_instance").value + ' usdl-core-cb:deprecationRecommendationTimePointBP ' + '"' + document.getElementById("recommendation_deprecated_from").value + '"^^xsd:date .');
        }
    }

    // Add classification
    kb_bp = addClassificationConcepts(kb_bp);

    // Create the SL schemas for qualitative values
    kb_bp = addQualSLSchemas(kb_bp);
    // Create the SL schemas for quantitative values
    kb_bp = addQuantSLSchemas(kb_bp);
    // Store bp with schemas to a global var
    kb_bp = addQualValues(kb_bp);

    // Dump the kb with the service description to a turtle format and show it in a separate window.
    var dmp = kb_bp.databank.dump({
        format: 'text/turtle',
        indent: true,
        serialize: true
    })
    var uueFile = Base64.encode(dmp)
    var uri = 'data:text/turtle;base64,' + encodeURIComponent(uueFile)
    window.open(uri)
}
// Other editor
function createQuantitativeIntTables() {
}
// Other editor
function createQuantitativeFloatTables() {
}

function createQualitativeTables() {
    var qual_sl_table = document.getElementById("qualserviceleveldetails");
    var anchor = document.getElementById("qualvalues");
    var tables_section = '';
    //tables_section = tables_section + '<div class="bc-buttongroup">';
    for (i = 1; i < qual_sl_table.rows.length; i++) {
        tables_section = tables_section + '<div class="panel panel-default"><div class="panel-heading"><H2>Specify qualitative values for ' + qual_sl_table.rows[i].cells[2].childNodes[0].value + '</H2></div>';
        tables_section = tables_section + '<div class="panel-body"><table style="width: 90%" id="table_' + qual_sl_table.rows[i].cells[2].childNodes[0].value + '"' + '>' + '<tr><th></th><th></th><th>Value</th><th style="width: 60%">Description</th><th>Ordinal relation to successor</th></tr> </table>';
        tables_section = tables_section + "<div style='width: 90%' class='bc-button4table'><button onclick='" + 'addQualValue(qual_table = ' + '"table_' + qual_sl_table.rows[i].cells[2].childNodes[0].value + '"' + ")'> Add </button>" +
                "<button onclick='" + 'deleteQualValue(qual_table = ' + '"table_' + qual_sl_table.rows[i].cells[2].childNodes[0].value + '"' + ")'> Delete </button></div></div></div>";
    }
    anchor.innerHTML = tables_section;
    $("#qualValuePanel").collapse('show');
    //window.alert(anchor.innerHTML);
}

function deleteQualitativeTables() {
    var anchor = document.getElementById("qualvalues");
    anchor.innerHTML = "";
    // tbd
}

function save_SLSchemas() {
    //Deactivate all input fields
    deactivateInputFields();
    // Create tables for qualitative value instances
    createQualitativeTables();
}

function deactivateInputFields() {
    document.getElementById("bp_namespace").disabled = true;
    document.getElementById("bp_business_entity").disabled = true;
    document.getElementById("bp_legal_name").disabled = true;
    document.getElementById("bp_instance").disabled = true;
    document.getElementById("bp_model").disabled = true;
    document.getElementById("slp_class").disabled = true;
    document.getElementById("classtaxpref").disabled = true;
    document.getElementById("classtaxroot").disabled = true;
    document.getElementById("classtaxURI").disabled = true;

    deactivateQuantSLSchemaTable();
    document.getElementById("quant_sl_table_add").disabled = true;
    document.getElementById("quant_sl_table_delete").disabled = true;
    deactivateQualSLSchemaTable();
    document.getElementById("qual_sl_table_add").disabled = true;
    document.getElementById("qual_sl_table_delete").disabled = true;
    deactivateClassTaxTable();
    document.getElementById("classtax_table_add").disabled = true;
    document.getElementById("classtax_table_delete").disabled = true;

    document.getElementById("safe_schemas").disabled = true;
    document.getElementById("edit_schemas").disabled = false;
}

function deactivateQuantSLSchemaTable() {
    var quant_sl_table = document.getElementById("quantserviceleveldetails");
    for (i = 1; i < quant_sl_table.rows.length; i++) {

        quant_sl_table.rows[i].cells[2].childNodes[0].disabled = true;
        quant_sl_table.rows[i].cells[3].childNodes[0].disabled = true;
        quant_sl_table.rows[i].cells[4].childNodes[0].disabled = true;
        quant_sl_table.rows[i].cells[5].childNodes[0].disabled = true;
        quant_sl_table.rows[i].cells[6].childNodes[0].disabled = true;
        quant_sl_table.rows[i].cells[7].childNodes[0].disabled = true;
        quant_sl_table.rows[i].cells[8].childNodes[0].disabled = true;
        quant_sl_table.rows[i].cells[9].childNodes[0].disabled = true;
    }
}

function activateQuantSLSchemaTable() {
    var quant_sl_table = document.getElementById("quantserviceleveldetails");
    for (i = 1; i < quant_sl_table.rows.length; i++) {

        quant_sl_table.rows[i].cells[2].childNodes[0].disabled = false;
        quant_sl_table.rows[i].cells[3].childNodes[0].disabled = false;
        quant_sl_table.rows[i].cells[4].childNodes[0].disabled = false;
        quant_sl_table.rows[i].cells[5].childNodes[0].disabled = false;
        quant_sl_table.rows[i].cells[6].childNodes[0].disabled = false;
        quant_sl_table.rows[i].cells[7].childNodes[0].disabled = false;
        quant_sl_table.rows[i].cells[8].childNodes[0].disabled = false;
        quant_sl_table.rows[i].cells[9].childNodes[0].disabled = false;
    }
}

function deactivateQualSLSchemaTable() {
    var qual_sl_table = document.getElementById("qualserviceleveldetails");
    for (i = 1; i < qual_sl_table.rows.length; i++) {
        qual_sl_table.rows[i].cells[2].childNodes[0].disabled = true;
        qual_sl_table.rows[i].cells[3].childNodes[0].disabled = true;
    }
}

function activateQualSLSchemaTable() {
    var qual_sl_table = document.getElementById("qualserviceleveldetails");
    for (i = 1; i < qual_sl_table.rows.length; i++) {
        qual_sl_table.rows[i].cells[2].childNodes[0].disabled = false;
        qual_sl_table.rows[i].cells[3].childNodes[0].disabled = false;
    }
}

function deactivateClassTaxTable() {
    var qual_sl_table = document.getElementById("classtaxconcepts");
    for (i = 1; i < qual_sl_table.rows.length; i++) {
        qual_sl_table.rows[i].cells[2].childNodes[0].disabled = true;
        qual_sl_table.rows[i].cells[3].childNodes[0].disabled = true;
        qual_sl_table.rows[i].cells[4].childNodes[0].disabled = true;
    }
}

function activateClassTaxTable() {
    var qual_sl_table = document.getElementById("classtaxconcepts");
    for (i = 1; i < qual_sl_table.rows.length; i++) {
        qual_sl_table.rows[i].cells[2].childNodes[0].disabled = false;
        qual_sl_table.rows[i].cells[3].childNodes[0].disabled = false;
        qual_sl_table.rows[i].cells[4].childNodes[0].disabled = false;
    }
}

function activateInputFields() {
    document.getElementById("bp_namespace").disabled = false;
    document.getElementById("bp_business_entity").disabled = false;
    document.getElementById("bp_legal_name").disabled = false;
    document.getElementById("bp_instance").disabled = false;
    document.getElementById("bp_model").disabled = false;
    document.getElementById("slp_class").disabled = false;
    document.getElementById("classtaxpref").disabled = false;
    document.getElementById("classtaxroot").disabled = false;
    document.getElementById("classtaxURI").disabled = false;
    activateQuantSLSchemaTable();
    document.getElementById("quant_sl_table_add").disabled = false;
    document.getElementById("quant_sl_table_delete").disabled = false;
    activateQualSLSchemaTable();
    document.getElementById("qual_sl_table_add").disabled = false;
    document.getElementById("qual_sl_table_delete").disabled = false;
    activateClassTaxTable();
    document.getElementById("classtax_table_add").disabled = false;
    document.getElementById("classtax_table_delete").disabled = false;

    document.getElementById("safe_schemas").disabled = false;
    document.getElementById("edit_schemas").disabled = true;
    deleteQualitativeTables();
    $('#qualValuePanel').collapse('hide');
}

function allowDrop(event) {
    event.preventDefault();
}
findBase = function (kb) {
    var base = kb.databank.baseURI;
    var services = kb.where("?brokerPolicy a ?serviceModel")
            .where("?serviceModel rdfs:subClassOf usdl-core:ServiceModel")
            .where("?brokerPolicy usdl-core-cb:validFrom ?validFrom");

    services.each(function () {
        var selection_class = this["serviceModel"];
        var selection_instance = this["brokerPolicy"];
        var validFrom = this["validFrom"];

        var url_class = selection_class.value._string;
        var url_instance = selection_instance.value._string;
        base = url_class.split('#')[0];
        document.getElementById("bp_namespace").value = base;
        // Assign the service model class and instance to the business policy form
        document.getElementById("bp_model").value = url_class.split('#')[1];
        document.getElementById("bp_instance").value = url_instance.split('#')[1];
        document.getElementById("valid_from").value = validFrom.value;
    })
    var validthrough = kb.where("?brokerPolicy a ?serviceModel")
            .where("?serviceModel rdfs:subClassOf usdl-core:ServiceModel")
            .where("?brokerPolicy usdl-core-cb:validThrough ?validThrough");

    validthrough.each(function () {
        var validThrough = this["validThrough"];
        document.getElementById("valid_through").value = validThrough.value;
    })
    var successor = kb.where("?brokerPolicy a ?serviceModel")
            .where("?serviceModel rdfs:subClassOf usdl-core:ServiceModel")
            .where("?brokerPolicy gr:successorOf ?successor");
    successor.each(function () {
        var successor_of = this["successor"];
        document.getElementById("successor_of_bp").value = successor_of.value._string;
    })
    var onboarding = kb.where("?brokerPolicy a ?serviceModel")
            .where("?serviceModel rdfs:subClassOf usdl-core:ServiceModel")
            .where("?brokerPolicy gr:successorOf ?successor")
            .where("?brokerPolicy usdl-core-cb:deprecationOnboardingTimePoint ?onboarding");
    onboarding.each(function () {
        var onboarding_date = this["onboarding"];
        document.getElementById("onboarding_deprecated_from").value = onboarding_date.value;
    })
    var recommendation = kb.where("?brokerPolicy a ?serviceModel")
            .where("?serviceModel rdfs:subClassOf usdl-core:ServiceModel")
            .where("?brokerPolicy gr:successorOf ?successor")
            .where("?brokerPolicy usdl-core-cb:deprecationRecommendationTimePointBP ?recommendation");
    recommendation.each(function () {
        var recommendation_date = this["recommendation"];
        document.getElementById("recommendation_deprecated_from").value = recommendation_date.value;
    })
    var business_entity = kb.where("?bentity a gr:BusinessEntity")
            .where("?bentity gr:legalName ?legalName")
    business_entity.each(function () {
        var bizentity = this["bentity"];
        var legalname = this["legalName"];

        var url_bizentity = bizentity.value._string;

        // Assign the service model class and instance to the business policy form
        document.getElementById("bp_business_entity").value = url_bizentity.split('#')[1];
        document.getElementById("bp_legal_name").value = legalname.value;

    })

    return base
}

function addQuantSLConcept() {
    var table = document.getElementById("quantserviceleveldetails");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    //var element1 = document.createElement("input");
    //element1.type = "checkbox";
    //element1.type = "chkbox[]";
    //cell1.appendChild(element1);
    cell1.innerHTML = checkboxStatic;
    var cell2 = row.insertCell(1);
    cell2.innerHTML = rowCount + 1;
    var cell3 = row.insertCell(2);
    cell3.innerHTML = "<input type='text'>";
    var cell4 = row.insertCell(3);
    cell4.innerHTML = "<input type='text'>";
    var cell5 = row.insertCell(4);
    cell5.innerHTML = "<input type='text'>";
    var cell6 = row.insertCell(5);
    cell6.innerHTML = "<select name='valuetype' id='value_type' > <option>integer</option> <option>float</option> </select>";
    var cell7 = row.insertCell(6);
    cell7.innerHTML = "<input type='text'>";
    var cell8 = row.insertCell(7);
    cell8.innerHTML = "<input type='text'>";
    var cell9 = row.insertCell(8);
    cell9.innerHTML = "<input type='checkbox'>";
    var cell10 = row.insertCell(9);
    cell10.innerHTML = "<input type='checkbox'>";
}

function deleteQuantSLConcept() {
    try {
        var table = document.getElementById("quantserviceleveldetails");
        var rowCount = table.rows.length;
        for (var i = 1; i < rowCount; i++) {
            var row = table.rows[i];
            var chkbox = row.cells[0].childNodes[0].childNodes[0].childNodes[0];
            if (null != chkbox && true == chkbox.checked) {
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
    } catch (e) {
        alert(e);
    }
}

function addQualSLConcept() {
    var table = document.getElementById("qualserviceleveldetails");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);

    cell1.innerHTML = checkboxStatic;
    var cell2 = row.insertCell(1);
    cell2.innerHTML = rowCount + 1;
    var cell3 = row.insertCell(2);
    cell3.innerHTML = "<input type='text'>";
    var cell4 = row.insertCell(3);
    cell4.innerHTML = "<input type='text'>";
}

function addClassificationConcept() {
    var table = document.getElementById("classtaxconcepts");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);

    cell1.innerHTML = checkboxStatic;
    var cell2 = row.insertCell(1);
    cell2.innerHTML = rowCount + 1;
    var cell3 = row.insertCell(2);
    cell3.innerHTML = "<input type='text'>";
    var cell4 = row.insertCell(3);
    cell4.innerHTML = "<input type='text'>";
    var cell5 = row.insertCell(4);
    cell5.innerHTML = "<input type='text'>";

}

function addQualValue(qual_table) {
    var table = document.getElementById(qual_table);
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);

    cell1.innerHTML = checkboxStatic;
    var cell2 = row.insertCell(1);
    cell2.innerHTML = rowCount + 1;
    var cell3 = row.insertCell(2);
    cell3.innerHTML = "<input type='text'>";
    var cell4 = row.insertCell(3);
    cell4.innerHTML = "<input type='text'>";
    var cell5 = row.insertCell(4);
    cell5.innerHTML = "<select name='ordinal' id='ordinal_rel' > <option>nonEqual</option> <option>lesser</option> </select>";
    //cell5.innerHTML = "<select name='ordinal' id='ordinal_rel' > <option>nonEqual</option> <option>lesser</option> </select>";
}

function deleteQualSLConcept() {
    try {
        var table = document.getElementById("qualserviceleveldetails");
        var rowCount = table.rows.length;
        for (var i = 1; i < rowCount; i++) {
            var row = table.rows[i];
            var chkbox = row.cells[0].childNodes[0].childNodes[0].childNodes[0];
            if (null != chkbox && true == chkbox.checked) {
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
    } catch (e) {
        alert(e);
    }
}

function deleteClassificationConcept() {
    try {
        var table = document.getElementById("classtaxconcepts");
        var rowCount = table.rows.length;
        for (var i = 1; i < rowCount; i++) {
            var row = table.rows[i];
            var chkbox = row.cells[0].childNodes[0].childNodes[0].childNodes[0];
            if (null != chkbox && true == chkbox.checked) {
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
    } catch (e) {
        alert(e);
    }
}

function deleteQualValue(qual_table) {
    try {
        var table = document.getElementById(qual_table);
        var rowCount = table.rows.length;
        for (var i = 1; i < rowCount; i++) {
            var row = table.rows[i];
            var chkbox = row.cells[0].childNodes[0].childNodes[0].childNodes[0];
            if (null != chkbox && true == chkbox.checked) {
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
    } catch (e) {
        alert(e);
    }
}

function addConcept() {
    var table = document.getElementById("class_table");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    //var element1 = document.createElement("input");
    //element1.type = "checkbox";
    //element1.type = "chkbox[]";
    //cell1.appendChild(element1);
    cell1.innerHTML = checkboxStatic;
    var cell2 = row.insertCell(1);
    cell2.innerHTML = rowCount + 1;
    var cell3 = row.insertCell(2);
    var tax_class = document.getElementById("classtaxonomy").value;
    cell3.innerHTML = tax_class;
}

function deleteConcept() {
    try {
        var table = document.getElementById("class_table");
        var rowCount = table.rows.length;
        for (var i = 1; i < rowCount; i++) {
            var row = table.rows[i];
            var chkbox = row.cells[0].childNodes[0].childNodes[0].childNodes[0];
            if (null != chkbox && true == chkbox.checked) {
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
    } catch (e) {
        alert(e);
    }
}

function addClassificationConcepts(kb) {
    // Add concept scheme
    kb.add(document.getElementById("classtaxpref").value + ":" + document.getElementById("bp_instance").value + "ConceptScheme a skos:ConceptScheme .")
    kb.add(document.getElementById("classtaxpref").value + ":" + document.getElementById("bp_instance").value + "ConceptScheme" + ' dcterms:title "Root for all classification dimensions." .')
    kb.add(document.getElementById("classtaxpref").value + ":" + document.getElementById("bp_instance").value + "ConceptScheme" + ' skos:prefLabel "Root Concept Scheme"@en .')
    kb.add(document.getElementById("classtaxpref").value + ":" + document.getElementById("bp_instance").value + "ConceptScheme" + " skos:hasTopConcept " + document.getElementById("classtaxpref").value + ":" + document.getElementById("classtaxroot").value + " .")
    //Add root concept

    kb.add(document.getElementById("classtaxpref").value + ":" + document.getElementById("classtaxroot").value + " a usdl-core-cb:ClassificationDimension .")
    kb.add(document.getElementById("classtaxpref").value + ":" + document.getElementById("classtaxroot").value + ' skos:prefLabel "Root Concept"@en .')
    kb.add(document.getElementById("classtaxpref").value + ":" + document.getElementById("classtaxroot").value + " skos:topConceptOf " + document.getElementById("classtaxpref").value + ":" + document.getElementById("bp_instance").value + "ConceptScheme .")
    kb.add(document.getElementById("classtaxpref").value + ":" + document.getElementById("classtaxroot").value + " skos:inScheme " + document.getElementById("classtaxpref").value + ":" + document.getElementById("bp_instance").value + "ConceptScheme .")

    var classtax_table = document.getElementById("classtaxconcepts");
    for (j = 1; j < classtax_table.rows.length; j++) {
        kb.add(document.getElementById("classtaxpref").value + ":" + document.getElementById("classtaxroot").value + " skos:narrower " + document.getElementById("classtaxpref").value + ":" + classtax_table.rows[j].cells[2].childNodes[0].value + " .")
        kb.add(document.getElementById("classtaxpref").value + ":" + classtax_table.rows[j].cells[2].childNodes[0].value + " a usdl-core-cb:ClassificationDimension .")
        kb.add(document.getElementById("classtaxpref").value + ":" + classtax_table.rows[j].cells[2].childNodes[0].value + " dcterms:title " + '"' + classtax_table.rows[j].cells[3].childNodes[0].value + '" .')
        kb.add(document.getElementById("classtaxpref").value + ":" + classtax_table.rows[j].cells[2].childNodes[0].value + " skos:prefLabel " + '"' + classtax_table.rows[j].cells[4].childNodes[0].value + '"@en .')
        kb.add(document.getElementById("classtaxpref").value + ":" + classtax_table.rows[j].cells[2].childNodes[0].value + " skos:broader " + document.getElementById("classtaxpref").value + ":" + document.getElementById("classtaxroot").value + " .")
        kb.add(document.getElementById("classtaxpref").value + ":" + classtax_table.rows[j].cells[2].childNodes[0].value + " skos:inScheme " + document.getElementById("classtaxpref").value + ":" + document.getElementById("bp_instance").value + "ConceptScheme .");
    }

    return kb;
}

function addQualValues(kb) {
    var qual_sl_table = document.getElementById("qualserviceleveldetails");
    for (i = 1; i < qual_sl_table.rows.length; i++) {
        var table_id = "table_" + qual_sl_table.rows[i].cells[2].childNodes[0].value;
        var qual_value_type = qual_sl_table.rows[i].cells[2].childNodes[0].value;
        var qual_values_table = document.getElementById(table_id);
        for (j = 1; j < qual_values_table.rows.length; j++) {
            var qual_value = qual_values_table.rows[j].cells[2].childNodes[0].value;
            kb.add("bp:" + qual_value + " a " + "bp:" + qual_value_type + " .");
            kb.add("bp:" + qual_value + " rdfs:label " + '"' + qual_values_table.rows[j].cells[3].childNodes[0].value + '"@en .');
            if (j < qual_values_table.rows.length - 1) {
                kb.add("bp:" + qual_value + " gr:" + qual_values_table.rows[j].cells[4].childNodes[0].value + " bp:" + qual_values_table.rows[j + 1].cells[2].childNodes[0].value + " .")
            }
        }
    }
    return kb;
}

function addQualSLSchemas(kb) {
    var qual_sl_table = document.getElementById("qualserviceleveldetails");
    for (i = 1; i < qual_sl_table.rows.length; i++) {
        var qual_value_type = qual_sl_table.rows[i].cells[2].childNodes[0].value;
        // SL subclass
        kb.add("bp:" + "SL" + qual_value_type + " rdfs:subClassOf usdl-sla:ServiceLevel .")
                // SL subproperty
                .add("bp:" + "hasSL" + qual_value_type + " rdfs:subPropertyOf usdl-sla:hasServiceLevel .")
                .add("bp:" + "hasSL" + qual_value_type + " rdfs:domain " + "bp:" + document.getElementById("slp_class").value + " .")
                .add("bp:" + "hasSL" + qual_value_type + " rdfs:range " + "bp:" + "SL" + qual_value_type + " .")

        // SLE subclass
        kb.add("bp:" + "SLE" + qual_value_type + " rdfs:subClassOf usdl-sla:ServiceLevelExpression .")
                // SLE subproperty
                .add("bp:" + "hasSLE" + qual_value_type + " rdfs:subPropertyOf usdl-sla:hasServiceLevelExpression .")
                .add("bp:" + "hasSLE" + qual_value_type + " rdfs:domain " + "bp:" + "SL" + qual_value_type + " .")
                .add("bp:" + "hasSLE" + qual_value_type + " rdfs:range " + "bp:" + "SLE" + qual_value_type + " .")

        // Var subclass
        kb.add("bp:" + "Var" + qual_value_type + " rdfs:subClassOf usdl-sla:Variable .")
                // Var subproperty
                .add("bp:" + "hasVar" + qual_value_type + " rdfs:subPropertyOf usdl-sla:hasVariable .")
                .add("bp:" + "hasVar" + qual_value_type + " rdfs:domain " + "bp:" + "SLE" + qual_value_type + " .")
                .add("bp:" + "hasVar" + qual_value_type + " rdfs:range " + "bp:" + "Var" + qual_value_type + " .")
        // qualitative value subclass

        kb.add("bp:" + qual_value_type + " rdfs:subClassOf gr:QualitativeValue .")
                .add("bp:" + qual_value_type + ' rdfs:label "' + qual_sl_table.rows[i].cells[3].childNodes[0].value + '"@en .')

        // Value subproperty
        kb.add("bp:" + "hasDefault" + qual_value_type + " rdfs:subPropertyOf usdl-sla-cb:hasDefaultQualitativeValue .")
                .add("bp:" + "hasDefault" + qual_value_type + " rdfs:domain " + "bp:" + "Var" + qual_value_type + " .")
                .add("bp:" + "hasDefault" + qual_value_type + " rdfs:range " + "bp:" + qual_value_type + " .")

        kb.add("bp:" + "has" + qual_value_type + " rdfs:subPropertyOf gr:qualitativeProductOrServiceProperty .")
                .add("bp:" + "has" + qual_value_type + " rdfs:domain " + "bp:" + document.getElementById("bp_model").value + " .")
                .add("bp:" + "has" + qual_value_type + " rdfs:range " + "bp:" + qual_value_type + " .")
        // Pref var subclass
        kb.add("bp:" + qual_value_type + "PreferenceVariable" + " rdfs:subClassOf usdl-pref:QualitativeVariable .")
                .add("bp:" + qual_value_type + "PreferenceVariable" + " usdl-pref:belongsTo " + document.getElementById("classtaxpref").value + ":" + document.getElementById("classtaxroot").value + " .")
                .add("bp:" + qual_value_type + "PreferenceVariable" + " usdl-pref:refToServiceAttribute " + "<http://www.brokeratcloud.eu/v1/opt/SERVICE-ATTRIBUTE#null>" + " .")
        //Pref var subproperty
        kb.add("bp:" + "hasDefaultPrefVar" + qual_value_type + " rdfs:subPropertyOf usdl-pref:hasDefaultQualitativeValue .")
                .add("bp:" + "hasDefaultPrefVar" + qual_value_type + " rdfs:domain " + "bp:" + qual_value_type + "PreferenceVariable" + " .")
                .add("bp:" + "hasDefaultPrefVar" + qual_value_type + " rdfs:range " + "bp:" + qual_value_type + " .")
    }
    return kb;
}


function addQuantSLSchemas(kb) {
    var quant_sl_table = document.getElementById("quantserviceleveldetails");
    for (i = 1; i < quant_sl_table.rows.length; i++) {
        var quant_type = quant_sl_table.rows[i].cells[2].childNodes[0].value;
        // SL subclass
        kb.add("bp:" + "SL" + quant_type + " rdfs:subClassOf usdl-sla:ServiceLevel .")
                // SL subproperty
                .add("bp:" + "hasSL" + quant_type + " rdfs:subPropertyOf usdl-sla:hasServiceLevel .")
                .add("bp:" + "hasSL" + quant_type + " rdfs:domain " + "bp:" + document.getElementById("slp_class").value + " .")
                .add("bp:" + "hasSL" + quant_type + " rdfs:range " + "bp:" + "SL" + quant_type + " .")

        // SLE subclass
        kb.add("bp:" + "SLE" + quant_type + " rdfs:subClassOf usdl-sla:ServiceLevelExpression .")
                // SLE subproperty
                .add("bp:" + "hasSLE" + quant_type + " rdfs:subPropertyOf usdl-sla:hasServiceLevelExpression .")
                .add("bp:" + "hasSLE" + quant_type + " rdfs:domain " + "bp:" + "SL" + quant_type + " .")
                .add("bp:" + "hasSLE" + quant_type + " rdfs:range " + "bp:" + "SLE" + quant_type + " .")

        // Var subclass
        kb.add("bp:" + "Var" + quant_type + " rdfs:subClassOf usdl-sla:Variable .")
                // Var subproperty
                .add("bp:" + "hasVar" + quant_type + " rdfs:subPropertyOf usdl-sla:hasVariable .")
                .add("bp:" + "hasVar" + quant_type + " rdfs:domain " + "bp:" + "SLE" + quant_type + " .")
                .add("bp:" + "hasVar" + quant_type + " rdfs:range " + "bp:" + "Var" + quant_type + " .")
        // int or float value subclass
        if (quant_sl_table.rows[i].cells[5].childNodes[0].value == "integer") {
            // Int value subclass
            kb.add("bp:" + quant_type + " rdfs:subClassOf gr:QuantitativeValueInteger .")
                    .add("bp:" + quant_type + ' rdfs:label "' + quant_sl_table.rows[i].cells[3].childNodes[0].value + '"@en .')
                    .add("bp:" + quant_type + ' gr:hasUnitOfMeasurement "' + quant_sl_table.rows[i].cells[4].childNodes[0].value + '"^^xsd:string .')
                    .add("bp:" + quant_type + ' gr:hasMinValueInteger "' + quant_sl_table.rows[i].cells[6].childNodes[0].value + '"^^<http://www.w3.org/2001/XMLSchema#integer> .')
                    .add("bp:" + quant_type + ' gr:hasMaxValueInteger "' + quant_sl_table.rows[i].cells[7].childNodes[0].value + '"^^<http://www.w3.org/2001/XMLSchema#integer> .')
            // Int value range instance
            kb.add("bp:" + quant_type + "ValueRange" + " a " + "bp:" + quant_type + " .")
                    .add("bp:" + quant_type + "ValueRange" + ' rdfs:label "' + quant_sl_table.rows[i].cells[3].childNodes[0].value + '"@en .')
                    .add("bp:" + quant_type + "ValueRange" + ' gr:hasUnitOfMeasurement "' + quant_sl_table.rows[i].cells[4].childNodes[0].value + '"^^xsd:string .')
                    .add("bp:" + quant_type + "ValueRange" + ' gr:hasMinValueInteger "' + quant_sl_table.rows[i].cells[6].childNodes[0].value + '"^^<http://www.w3.org/2001/XMLSchema#integer> .')
                    .add("bp:" + quant_type + "ValueRange" + ' gr:hasMaxValueInteger "' + quant_sl_table.rows[i].cells[7].childNodes[0].value + '"^^<http://www.w3.org/2001/XMLSchema#integer> .')

        } else {
            // Float value subclass
            kb.add("bp:" + quant_type + " rdfs:subClassOf gr:QuantitativeValueFloat .")
                    .add("bp:" + quant_type + ' rdfs:label "' + quant_sl_table.rows[i].cells[3].childNodes[0].value + '"@en .')
                    .add("bp:" + quant_type + ' gr:hasUnitOfMeasurement "' + quant_sl_table.rows[i].cells[4].childNodes[0].value + '"^^xsd:sttring .')
                    .add("bp:" + quant_type + ' gr:hasMinValueFloat "' + quant_sl_table.rows[i].cells[6].childNodes[0].value + '"^^xsd:float .')
                    .add("bp:" + quant_type + ' gr:hasMaxValueFloat "' + quant_sl_table.rows[i].cells[7].childNodes[0].value + '"^^xsd:float .')
            // Float value range instance
            kb.add("bp:" + quant_type + "ValueRange" + " a " + "bp:" + quant_type + " .")
                    .add("bp:" + quant_type + "ValueRange" + ' rdfs:label "' + quant_sl_table.rows[i].cells[3].childNodes[0].value + '"@en .')
                    .add("bp:" + quant_type + "ValueRange" + ' gr:hasUnitOfMeasurement "' + quant_sl_table.rows[i].cells[4].childNodes[0].value + '"^^xsd:string .')
                    .add("bp:" + quant_type + "ValueRange" + ' gr:hasMinValueFloat "' + quant_sl_table.rows[i].cells[6].childNodes[0].value + '"^^<http://www.w3.org/2001/XMLSchema#float> .')
                    .add("bp:" + quant_type + "ValueRange" + ' gr:hasMaxValueFloat "' + quant_sl_table.rows[i].cells[7].childNodes[0].value + '"^^<http://www.w3.org/2001/XMLSchema#float> .')

        }
        if (quant_sl_table.rows[i].cells[8].childNodes[0].checked == true) {
            kb.add("bp:" + quant_type + ' usdl-core-cb:isRange "true"^^xsd:boolean .')
        } else {
            kb.add("bp:" + quant_type + ' usdl-core-cb:isRange "false"^^xsd:boolean .')
        }
        if (quant_sl_table.rows[i].cells[9].childNodes[0].checked == true) {
            kb.add("bp:" + quant_type + ' usdl-core-cb:higherIsBetter "true"^^xsd:boolean .')
        } else {
            kb.add("bp:" + quant_type + ' usdl-core-cb:higherIsBetter "false"^^xsd:boolean .')
        }
        // Value subproperty
        kb.add("bp:" + "hasDefault" + quant_type + " rdfs:subPropertyOf usdl-sla-cb:hasDefaultQuantitativeValue .")
                .add("bp:" + "hasDefault" + quant_type + " rdfs:domain " + "bp:" + "Var" + quant_type + " .")
                .add("bp:" + "hasDefault" + quant_type + " rdfs:range " + "bp:" + quant_type + " .")
        kb.add("bp:" + "has" + quant_type + " rdfs:subPropertyOf gr:quantitativeProductOrServiceProperty .")
                .add("bp:" + "has" + quant_type + " rdfs:domain " + "bp:" + document.getElementById("bp_model").value + " .")
                .add("bp:" + "has" + quant_type + " rdfs:range " + "bp:" + quant_type + " .")
        // Pref var subclass
        kb.add("bp:" + quant_type + "PreferenceVariable" + " rdfs:subClassOf usdl-pref:QuantitativeVariable .")
                .add("bp:" + quant_type + "PreferenceVariable" + " usdl-pref:belongsTo " + document.getElementById("classtaxpref").value + ":" + document.getElementById("classtaxroot").value + " .")
                .add("bp:" + quant_type + "PreferenceVariable" + " usdl-pref:refToServiceAttribute " + "<http://www.brokeratcloud.eu/v1/opt/SERVICE-ATTRIBUTE#null>" + " .")
        //Pref var subproperty
        kb.add("bp:" + "hasDefaultPrefVar" + quant_type + " rdfs:subPropertyOf usdl-pref:hasDefaultQuantitativeValue .")
                .add("bp:" + "hasDefaultPrefVar" + quant_type + " rdfs:domain " + "bp:" + quant_type + "PreferenceVariable" + " .")
                .add("bp:" + "hasDefaultPrefVar" + quant_type + " rdfs:range " + "bp:" + quant_type + " .")

    }
    return kb;
}


function loadBP(event) {
    event.preventDefault();
    var dt = event.dataTransfer
    var files = dt.files
    if (files.length == 1) {

        var reader = new FileReader();
        reader.onload = function (event) {
            var content = event.target.result;
            var kb = $.rdf();
            kb.load(content);

            kb.prefix('foaf', 'http://xmlns.com/foaf/0.1/')
                    .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
                    .prefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#')
                    .prefix('owl', 'http://www.w3.org/2002/07/owl#')
                    .prefix('dcterms', 'http://purl.org/dc/terms/')
                    .prefix('usdl-core', 'http://www.linked-usdl.org/ns/usdl-core#')
                    .prefix('usdl-core-cb', 'http://www.linked-usdl.org/ns/usdl-core/cloud-broker#')
                    .prefix('usdl-sla', 'http://www.linked-usdl.org/ns/usdl-sla#')
                    .prefix('usdl-sla-cb', 'http://www.linked-usdl.org/ns/usdl-core/cloud-broker-sla#')
                    .prefix('usdl-business-roles', 'http://www.linked-usdl.org/ns/usdl-business-roles#')
                    .prefix('blueprint', 'http://bizweb.sap.com/TR/blueprint#')
                    .prefix('vcard', 'http://www.w3.org/2006/vcard/ns#')
                    .prefix('xsd', 'http://www.w3.org/2001/XMLSchema#')
                    .prefix('ctag', 'http://commontag.org/ns#')
                    .prefix('org', 'http://www.w3.org/ns/org#')
                    .prefix('skos', 'http://www.w3.org/2004/02/skos/core#')
                    .prefix('time', 'http://www.w3.org/2006/time#')
                    .prefix('gr', 'http://purl.org/goodrelations/v1#')
                    .prefix('doap', 'http://usefulinc.com/ns/doap#')
                    .base(findBase(kb) + "#");

            kb.prefix('bp', kb.base());

            loadClassificationTaxonomy(kb);

            //Load SLP class
            var slpclasses = kb.where("?slps rdfs:subClassOf usdl-sla:ServiceLevelProfile");
            slpclasses.each(function () {
                var sel = this["slps"];
                var url_slps = sel.value._string;
                document.getElementById("slp_class").value = url_slps.split('#')[1];
            })
            loadQuantitativeSLSchemas(kb);
            loadQualitativeSLSchemas(kb);
            save_SLSchemas();

            //load qual values

            loadQualValues(kb);

            //window.alert(kb.base());
            document.kb = kb;
        }
        reader.readAsText(files[0]);
        document.getElementById("bp").innerHTML = "Broker policy loaded!";
        $("#serviceEditArea").collapse('show');
        $("#serviceLoadArea").collapse('hide');

    }
}

function loadQualValues(kb) {
    var qual_sl_table = document.getElementById("qualserviceleveldetails");
    for (i = 1; i < qual_sl_table.rows.length; i++) {
        var table_id = "table_" + qual_sl_table.rows[i].cells[2].childNodes[0].value;
        var qual_value_type = qual_sl_table.rows[i].cells[2].childNodes[0].value;
        var query = kb.where("?valinst a bp:" + qual_value_type + "");
        //
        query.each(function () {
            var selection = this["valinst"];
            var qv_url = selection.value._string;
            var table = document.getElementById(table_id);
            var rowCount = table.rows.length;
            var row = table.insertRow(rowCount);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = checkboxStatic;
            var cell2 = row.insertCell(1);
            cell2.innerHTML = rowCount + 1;
            var cell3 = row.insertCell(2);
            cell3.innerHTML = "<input type='text'>";
            cell3.childNodes[0].value = qv_url.split("#")[1];
            var cell4 = row.insertCell(3);
            cell4.innerHTML = "<input type='text'>";
            //Label
            var label = kb.where("<" + qv_url + ">" + " rdfs:label ?label");
            label.each(function () {
                cell4.childNodes[0].value = this["label"].value;
            })
            //Ordinal
            var cell5 = row.insertCell(4);
            cell5.innerHTML = "<select name='ordinal' id='ordinal_rel' > <option>nonEqual</option> <option>lesser</option> </select>";
            //cell5.innerHTML = "<select name='ordinal' id='ordinal_rel' > <option>nonEqual</option> <option>lesser</option> </select>";
            var ordinal = kb.where("<" + qv_url + ">" + " gr:lesser ?successor");
            ordinal.each(function () {
                cell5.innerHTML = "<select name='ordinal' id='ordinal_rel' > <option>lesser</option> <option>nonEqual</option> </select>";
                //cell5.innerHTML = "<select name='ordinal' id='ordinal_rel' > <option>lesser</option> </select>"
            })
        })

    }
}

function loadQualitativeSLSchemas(kb) {
    var quant_sls = kb.where("?qvc rdfs:subClassOf gr:QualitativeValue");
    quant_sls.each(function () {
        var selection = this["qvc"];
        var sls_url = selection.value._string;
        var table = document.getElementById("qualserviceleveldetails");
        var rowCount = table.rows.length;
        var row = table.insertRow(rowCount);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = checkboxStatic;
        var cell2 = row.insertCell(1);
        cell2.innerHTML = rowCount + 1;
        var cell3 = row.insertCell(2);
        cell3.innerHTML = "<input type='text'>";
        cell3.childNodes[0].value = sls_url.split("#")[1];
        var cell4 = row.insertCell(3);
        cell4.innerHTML = "<input type='text'>";
        //Label
        var label = kb.where("<" + sls_url + ">" + " rdfs:label ?label");
        label.each(function () {
            cell4.childNodes[0].value = this["label"].value;
        })
    })
}

function loadQuantitativeSLSchemas(kb) {
    var quant_sls = kb.where("?qvc rdfs:subClassOf gr:QuantitativeValueInteger");
    quant_sls.each(function () {
        var selection = this["qvc"];
        var sls_url = selection.value._string;
        var table = document.getElementById("quantserviceleveldetails");
        var rowCount = table.rows.length;
        var row = table.insertRow(rowCount);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = checkboxStatic;
        var cell2 = row.insertCell(1);
        cell2.innerHTML = rowCount + 1;
        var cell3 = row.insertCell(2);
        cell3.innerHTML = "<input type='text'>";
        cell3.childNodes[0].value = sls_url.split("#")[1];
        var cell4 = row.insertCell(3);
        cell4.innerHTML = "<input type='text'>";
        var cell5 = row.insertCell(4);
        cell5.innerHTML = "<input type='text'>";
        var cell6 = row.insertCell(5);
        cell6.innerHTML = "<select name='valuetype' id='value_type' > <option>integer</option> <option>float</option> </select>";
        var cell7 = row.insertCell(6);
        cell7.innerHTML = "<input type='text'>";
        var cell8 = row.insertCell(7);
        cell8.innerHTML = "<input type='text'>";
        var cell9 = row.insertCell(8);
        cell9.innerHTML = "<input type='checkbox'>";
        var cell10 = row.insertCell(9);
        cell10.innerHTML = "<input type='checkbox'>";
        //Label
        var label = kb.where("<" + sls_url + ">" + " rdfs:label ?label");
        label.each(function () {
            cell4.childNodes[0].value = this["label"].value;
        })
        // Unit of Measurement
        var uom = kb.where("<" + sls_url + ">" + " gr:hasUnitOfMeasurement ?uom");
        uom.each(function () {
            cell5.childNodes[0].value = this["uom"].value;
        })
        // Min value integer
        var minv = kb.where("<" + sls_url + ">" + " gr:hasMinValueInteger ?minv");
        minv.each(function () {
            cell7.childNodes[0].value = this["minv"].value;
        })
        // Max value integer
        var maxv = kb.where("<" + sls_url + ">" + " gr:hasMaxValueInteger ?maxv");
        maxv.each(function () {
            cell8.childNodes[0].value = this["maxv"].value;
        })
        // Range
        var range = kb.where("<" + sls_url + ">" + " usdl-core-cb:isRange ?range");
        range.each(function () {
            if (this["range"].value.toString() == "true") {
                cell9.childNodes[0].checked = true;
            } else {
                cell9.childNodes[0].checked = false;
            }
        })
        //Higher is better
        var hib = kb.where("<" + sls_url + ">" + " usdl-core-cb:higherIsBetter ?hib");
        hib.each(function () {

            if (this["hib"].value.toString() == "true") {
                cell10.childNodes[0].checked = true;
            } else {
                cell10.childNodes[0].checked = false;
            }

        })
    })
    quant_sls = kb.where("?qvc rdfs:subClassOf gr:QuantitativeValueFloat");
    quant_sls.each(function () {
        var selection = this["qvc"];
        var sls_url = selection.value._string;
        var table = document.getElementById("quantserviceleveldetails");
        var rowCount = table.rows.length;
        var row = table.insertRow(rowCount);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = checkboxStatic;
        var cell2 = row.insertCell(1);
        cell2.innerHTML = rowCount + 1;
        var cell3 = row.insertCell(2);
        cell3.innerHTML = "<input type='text'>";

        cell3.childNodes[0].value = sls_url.split("#")[1];
        var cell4 = row.insertCell(3);
        cell4.innerHTML = "<input type='text'>";
        var cell5 = row.insertCell(4);
        cell5.innerHTML = "<input type='text'>";
        var cell6 = row.insertCell(5);
        cell6.innerHTML = "<select name='valuetype' id='value_type' > <option>float</option> <option>integer</option>  </select>";
        var cell7 = row.insertCell(6);
        cell7.innerHTML = "<input type='text'>";
        var cell8 = row.insertCell(7);
        cell8.innerHTML = "<input type='text'>";
        var cell9 = row.insertCell(8);
        cell9.innerHTML = "<input type='checkbox'>";
        var cell10 = row.insertCell(9);
        cell10.innerHTML = "<input type='checkbox'>";
        //Label
        var label = kb.where("<" + sls_url + ">" + " rdfs:label ?label");
        label.each(function () {
            cell4.childNodes[0].value = this["label"].value;
        })
        // Unit of Measurement
        var uom = kb.where("<" + sls_url + ">" + " gr:hasUnitOfMeasurement ?uom");
        uom.each(function () {
            cell5.childNodes[0].value = this["uom"].value;
        })
        // Min value integer
        var minv = kb.where("<" + sls_url + ">" + " gr:hasMinValueFloat ?minv");
        minv.each(function () {
            cell7.childNodes[0].value = this["minv"].value;
        })
        // Max value integer
        var maxv = kb.where("<" + sls_url + ">" + " gr:hasMaxValueFloat ?maxv");
        maxv.each(function () {
            cell8.childNodes[0].value = this["maxv"].value;
        })
        // Range
        var range = kb.where("<" + sls_url + ">" + " usdl-core-cb:isRange ?range");
        range.each(function () {
            if (this["range"].value.toString() == "true") {
                cell9.childNodes[0].checked = true;
            } else {
                cell9.childNodes[0].checked = false;
            }
        })

        //Higher is better

        var hib = kb.where("<" + sls_url + ">" + " usdl-core-cb:higherIsBetter ?hib");
        hib.each(function () {
            if (this["hib"].value.toString() == "true") {
                cell10.childNodes[0].checked = true;
            } else {
                cell10.childNodes[0].checked = false;
            }
        })

    })

}

function loadClassificationTaxonomy(kb) {
    // load top concept
    var topconcept = kb.where("?concept a usdl-core-cb:ClassificationDimension")
            .where("?scheme a skos:ConceptScheme")
            .where("?concept skos:topConceptOf ?scheme");
    var tc = "";
    topconcept.each(function () {
        var selection = this["concept"];
        var tc_url = selection.value._string;

        tc = tc_url;
        document.getElementById("classtaxURI").value = tc_url.split("#")[0];
        document.getElementById("classtaxroot").valueclasstaxroot = tc_url.split("#")[1];
    })
    var query = "?classconcept skos:broader <" + tc + ">";

    var classconcepts = kb.where(query)
            .where("?classconcept a usdl-core-cb:ClassificationDimension");
    var c_url = "";
    classconcepts.each(function () {
        var selection = this["classconcept"];
        var c_url = selection.value._string;
        var table = document.getElementById("classtaxconcepts");
        var rowCount = table.rows.length;
        var row = table.insertRow(rowCount);
        var cell1 = row.insertCell(0);

        cell1.innerHTML = checkboxStatic;
        var cell2 = row.insertCell(1);
        cell2.innerHTML = rowCount + 1;
        var cell3 = row.insertCell(2);
        cell3.innerHTML = "<input type='text'>";
        cell3.childNodes[0].value = c_url.split("#")[1];

        var cell4 = row.insertCell(3);
        cell4.innerHTML = "<input type='text'>";
        var cell5 = row.insertCell(4);
        cell5.innerHTML = "<input type='text'>";

        var title = kb.where("<" + c_url + ">" + " dcterms:title ?title");
        title.each(function () {
            cell4.childNodes[0].value = this["title"].value;
        })
        var label = kb.where("<" + c_url + ">" + " skos:prefLabel ?label");
        label.each(function () {
            cell5.childNodes[0].value = this["label"].value;
        })

    })

}






//
//Broker@Clound API
//


function preloadBP() {

    if ($("#policyID").val() > 0) {
        console.log("Loading Broker Policy with ID: " + $("#policyID").val());

        var content = Base64.decode(brokerPolicy);
        var kb = $.rdf();
        kb.load(content);

        kb.prefix('foaf', 'http://xmlns.com/foaf/0.1/')
                .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
                .prefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#')
                .prefix('owl', 'http://www.w3.org/2002/07/owl#')
                .prefix('dcterms', 'http://purl.org/dc/terms/')
                .prefix('usdl-core', 'http://www.linked-usdl.org/ns/usdl-core#')
                .prefix('usdl-core-cb', 'http://www.linked-usdl.org/ns/usdl-core/cloud-broker#')
                .prefix('usdl-sla', 'http://www.linked-usdl.org/ns/usdl-sla#')
                .prefix('usdl-sla-cb', 'http://www.linked-usdl.org/ns/usdl-core/cloud-broker-sla#')
                .prefix('usdl-business-roles', 'http://www.linked-usdl.org/ns/usdl-business-roles#')
                .prefix('blueprint', 'http://bizweb.sap.com/TR/blueprint#')
                .prefix('vcard', 'http://www.w3.org/2006/vcard/ns#')
                .prefix('xsd', 'http://www.w3.org/2001/XMLSchema#')
                .prefix('ctag', 'http://commontag.org/ns#')
                .prefix('org', 'http://www.w3.org/ns/org#')
                .prefix('skos', 'http://www.w3.org/2004/02/skos/core#')
                .prefix('time', 'http://www.w3.org/2006/time#')
                .prefix('gr', 'http://purl.org/goodrelations/v1#')
                .prefix('doap', 'http://usefulinc.com/ns/doap#')
                .base(findBase(kb) + "#");

        kb.prefix('bp', kb.base());

        loadClassificationTaxonomy(kb);

        //Load SLP class
        var slpclasses = kb.where("?slps rdfs:subClassOf usdl-sla:ServiceLevelProfile");
        slpclasses.each(function () {
            var sel = this["slps"];
            var url_slps = sel.value._string;
            document.getElementById("slp_class").value = url_slps.split('#')[1];
        })
        loadQuantitativeSLSchemas(kb);
        loadQualitativeSLSchemas(kb);
        save_SLSchemas();

        //load qual values

        loadQualValues(kb);

        //window.alert(kb.base());
        document.kb = kb;


        document.getElementById("bp").innerHTML = "Broker policy loaded!";
        $("#serviceEditArea").collapse('show');
        $("#serviceLoadArea").collapse('hide');
    }
}


function getCurrentBP() {
    var kb_bp = $.rdf()
            .base(document.getElementById("bp_namespace").value)
            .prefix('foaf', 'http://xmlns.com/foaf/0.1/')
            .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
            .prefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#')
            .prefix('owl', 'http://www.w3.org/2002/07/owl#')
            .prefix('dcterms', 'http://purl.org/dc/terms/')
            .prefix('usdl-core', 'http://www.linked-usdl.org/ns/usdl-core#')
            .prefix('usdl-core-cb', 'http://www.linked-usdl.org/ns/usdl-core/cloud-broker#')
            .prefix('usdl-sla', 'http://www.linked-usdl.org/ns/usdl-sla#')
            .prefix('usdl-sla-cb', 'http://www.linked-usdl.org/ns/usdl-core/cloud-broker-sla#')
            .prefix('usdl-pref', 'http://www.linked-usdl.org/ns/usdl-pref#')
            .prefix('usdl-business-roles', 'http://www.linked-usdl.org/ns/usdl-business-roles#')
            .prefix('blueprint', 'http://bizweb.sap.com/TR/blueprint#')
            .prefix('vcard', 'http://www.w3.org/2006/vcard/ns#')
            .prefix('xsd', 'http://www.w3.org/2001/XMLSchema#')
            .prefix('ctag', 'http://commontag.org/ns#')
            .prefix('org', 'http://www.w3.org/ns/org#')
            .prefix('skos', 'http://www.w3.org/2004/02/skos/core#')
            .prefix('time', 'http://www.w3.org/2006/time#')
            .prefix('gr', 'http://purl.org/goodrelations/v1#')
            .prefix('doap', 'http://usefulinc.com/ns/doap#')
            .prefix(document.getElementById("classtaxpref").value, document.getElementById("classtaxURI").value + "#")
            .prefix('bp', document.getElementById("bp_namespace").value + "#")
            //  .prefix('bp', document.kb.databank.baseURI)
            // Create the business entity of broker
            //.add("<" + document.getElementById("bp_business_entity").value + "> a gr:BusinessEntity .")
            .add("bp:" + document.getElementById("bp_business_entity").value + " a gr:BusinessEntity .")
            .add("bp:" + document.getElementById("bp_business_entity").value + ' gr:legalName ' + '"' + document.getElementById("bp_legal_name").value + '"^^xsd:string .')
            // Create the entity involvement instance and bind it to the broker business entity
            .add("bp:" + document.getElementById("bp_business_entity").value + "EntityInvolvement" + " a usdl-core:EntityInvolvement .")
            .add("bp:" + document.getElementById("bp_business_entity").value + "EntityInvolvement" + " usdl-core:withBusinessRole usdl-business-roles:intermediary .")
            .add("bp:" + document.getElementById("bp_business_entity").value + "EntityInvolvement" + " usdl-core:ofBusinessEntity " + "bp:" + document.getElementById("bp_business_entity").value + " .")
            // Create the business policy instance
            .add("bp:" + document.getElementById("bp_instance").value + " a " + "bp:" + document.getElementById("bp_model").value + " .")
            .add("bp:" + document.getElementById("bp_instance").value + " dcterms:creator " + "bp:" + document.getElementById("bp_business_entity").value + " .")
            .add("bp:" + document.getElementById("bp_instance").value + " usdl-core:hasEntityInvolvement " + "bp:" + document.getElementById("bp_business_entity").value + "EntityInvolvement .")
            .add("bp:" + document.getElementById("bp_instance").value + " usdl-core-cb:hasClassificationDimension " + document.getElementById("classtaxpref").value + ":" + document.getElementById("classtaxroot").value + " .")
            // Create the bp service model
            .add("bp:" + document.getElementById("bp_model").value + " rdfs:subClassOf usdl-core:ServiceModel .")
            // Create the SL profile
            .add("bp:" + document.getElementById("slp_class").value + " rdfs:subClassOf usdl-sla:ServiceLevelProfile .")
            .add("bp:" + "has" + document.getElementById("slp_class").value + " rdfs:subPropertyOf usdl-sla:hasServiceLevelProfile .")
            .add("bp:" + "has" + document.getElementById("slp_class").value + " rdfs:domain " + "bp:" + document.getElementById("bp_model").value + " .")
            .add("bp:" + "has" + document.getElementById("slp_class").value + " rdfs:range " + "bp:" + document.getElementById("slp_class").value + " .");

    //Broker policy lifecycle management 
    //Create validFrom and valid through
    kb_bp.add("bp:" + document.getElementById("bp_instance").value + ' usdl-core-cb:validFrom ' + '"' + document.getElementById("valid_from").value + '"^^xsd:date .')
    if (document.getElementById("valid_through").value != "") {
        kb_bp.add("bp:" + document.getElementById("bp_instance").value + ' usdl-core-cb:validThrough ' + '"' + document.getElementById("valid_through").value + '"^^xsd:date .')
    }
    // Create successor of and deprecation properties, if any.
    // Deprecation properties will not be created if there is no successor of even if values are provided!
    if (document.getElementById("successor_of_bp").value != "") {
        kb_bp.add("bp:" + document.getElementById("bp_instance").value + " gr:successorOf <" + document.getElementById("successor_of_bp").value + "> .");
        if (document.getElementById("onboarding_deprecated_from").value != "") {
            kb_bp.add("bp:" + document.getElementById("bp_instance").value + ' usdl-core-cb:deprecationOnboardingTimePoint ' + '"' + document.getElementById("onboarding_deprecated_from").value + '"^^xsd:date .');
        }
        if (document.getElementById("recommendation_deprecated_from").value != "") {
            kb_bp.add("bp:" + document.getElementById("bp_instance").value + ' usdl-core-cb:deprecationRecommendationTimePointBP ' + '"' + document.getElementById("recommendation_deprecated_from").value + '"^^xsd:date .');
        }
    }

    // Add classification
    kb_bp = addClassificationConcepts(kb_bp);

    // Create the SL schemas for qualitative values
    kb_bp = addQualSLSchemas(kb_bp);
    // Create the SL schemas for quantitative values
    kb_bp = addQuantSLSchemas(kb_bp);
    // Store bp with schemas to a global var
    kb_bp = addQualValues(kb_bp);

    // Dump the kb with the service description to a turtle format and show it in a separate window.
    var dmp = kb_bp.databank.dump({
        format: 'text/turtle',
        indent: true,
        serialize: true
    })
    return Base64.encode(dmp)
}


$(document).ready(function () {
    preloadBP();
});


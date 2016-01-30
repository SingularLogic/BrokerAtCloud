<!DOCTYPE html>
<html>
    <head>
        <title>Flavors &mdash; ORBI</title>

        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="../assets/css/bootstrap.min.css" type="text/css" />
        <link rel="stylesheet" href="../assets/css/orbi.css" type="text/css" />
        <link href="http://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css" />
    </head>

    <body>

        <!-- Include Header -->
        <%@include file="../inc/header.jsp" %>

        <main>
            <div class="container">
                <div class="col-md-3">
                    <nav>
                        <ul>
                            <li class="title">Menu</li>
                            <li><a href="/orbibroker/dashboard">Dashboard</a></li>
                            <li><a href="/orbibroker/servicedesc/list">Service Description Mgmt</a></li>
                            <li><a href="/orbibroker/iaasconfig/list">IaaS Configuration Mgmt</a></li>
                            <li><a href="/orbibroker/appstore/list">App Store</a></li>
                            <li><a class="active" href="/orbibroker/flavors/list">Flavors</a></li>
                            <li><a href="/orbibroker/offerings/list">Offerings</a></li>
                            <li><a href="/orbibroker/pulsar/notifications">Notifications</a></li>
                        </ul>
                    </nav>
                </div>

                <div class="col-md-9">

                    <a href="/orbibroker/flavors/add" class="btn btn-danger pull-right action-button disabled">Add New</a>
                    <h2>Flavors<p class="lead"><span class="glyphicon glyphicon-asterisk"></span> Flavors List</p></h2>

                    <div class="table-responsive wrapper col-md-12">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th class="col-md-7">Flavor Details</th>
                                    <th class="col-md-2">Date Edited</th>
                                    <th class="col-md-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:forEach items="${flavors}" var="flavors">
                                    <tr>
                                        <td class="truncate"><strong><c:out value="${flavors.name}"></c:out></strong><br/><c:out value="${flavors.parameters}"></c:out></td>
                                        <td class="timestamp"><c:out value="${fn:substring(flavors.date_edited, 0, 16)}"></c:out></td>
                                            <td class="actions">
                                                <a class="pull-right btn btn-default btn-sm disabled" href="?remove=<c:out value="${flavors.id}"></c:out>"><span class="glyphicon glyphicon-trash" title="Delete"></span></a>
                                                <a class="pull-right btn btn-default btn-sm disabled" href="edit?id=<c:out value="${flavors.id}"></c:out>"><span class="glyphicon glyphicon-edit" title="Edit"></span></a>
                                            </td>
                                        </tr>
                                </c:forEach>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </main>

        <!-- Include Footer -->
        <%@include file="../inc/footer.jsp" %>

        <script src="../assets/js/jquery-2.1.4.min.js"></script>
        <script src="../assets/js/bootstrap.min.js"></script>
        <script src="../assets/js/orbi.js"></script>

    </body>

</html>
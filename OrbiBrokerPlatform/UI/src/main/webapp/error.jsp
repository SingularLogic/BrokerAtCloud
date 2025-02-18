<!DOCTYPE html>
<html>
    <head>
        <title>Error &mdash; ORBI</title>

        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="assets/css/bootstrap.min.css" type="text/css" />
        <link rel="stylesheet" href="assets/css/orbi.css" type="text/css" />
        <link href="http://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css" />
    </head>

    <body>

        <!-- Include Header Bar -->
        <%@include file="inc/header.jsp" %>

        <main>
            <div class="container">
                <section id="login">
                    <div class="container">
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="form-wrap">
                                    <img src="assets/img/ORBI_LOGO_ICON.png" width="200px">
                                    <h4>Log in with your account</h4>
                                    <div class="alert alert-danger" role="alert" >
                                        <h4><strong>ERROR!!!</strong></h4>
                                        <span>The username or password is incorrect.</span>
                                    </div>
                                    <form role="form"  action='<%= response.encodeURL("j_security_check")%>' method="post" id="login-form" autocomplete="off">
                                        <div class="form-group">
                                            <label for="username" class="sr-only">Username</label>
                                            <input type="text" name="j_username" id="username" class="form-control" placeholder="Username" autofocus>
                                        </div>
                                        <div class="form-group">
                                            <label for="key" class="sr-only">Password</label>
                                            <input name="j_password" type="password" name="key" id="key" class="form-control" placeholder="Password">
                                        </div>
                                        <input type="submit" id="btn-login" class="btn btn-primary btn-block" value="Log in">
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>

        <!-- Include Footer -->
        <%@include file="inc/footer.jsp" %>

        <script src="assets/js/jquery-2.1.4.min.js"></script>
        <script src="assets/js/bootstrap.min.js"></script>
        <script src="assets/js/orbi.js"></script>

    </body>

</html>
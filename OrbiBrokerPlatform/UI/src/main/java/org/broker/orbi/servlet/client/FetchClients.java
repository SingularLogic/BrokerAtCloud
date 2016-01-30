package org.broker.orbi.servlet.client;

import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.broker.orbi.models.Consumer;
import org.broker.orbi.service.ClientService;

/**
 *
 * @author Christos Paraskeva <ch.paraskeva at gmail dot com>
 */
@WebServlet(name = "ClientsList", urlPatterns = {"/clients/list"})
public class FetchClients extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");

        //Check delete action
        if (null != request.getParameter("remove")) {
            ClientService.removeConsumer(Integer.parseInt(request.getParameter("remove")));
        }

        String username = request.getUserPrincipal().getName();
        List<Consumer> consumers = ClientService.getAllConsumers();
        request.setAttribute("consumers", consumers);
        response.setContentType("text/html;charset=UTF-8");
        request.setAttribute("username", username);
        request.getRequestDispatcher("/clients/list.jsp").forward(request, response);
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}

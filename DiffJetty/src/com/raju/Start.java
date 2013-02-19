package com.raju;

import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.bio.SocketConnector;
import org.mortbay.jetty.servlet.Context;
import org.mortbay.jetty.servlet.ServletHolder;
import org.mortbay.jetty.webapp.WebAppContext;

public class Start {
	private static Server server;

	public static void main(String[] args) throws Exception {
		server = new Server();
		SocketConnector connector = new SocketConnector();
		connector.setPort(7501);
		server.setConnectors(new Connector[] { connector });
		Context root = new Context(server, "/embed", Context.SESSIONS);
		root.addServlet(new ServletHolder(new DiffServlet()), "/DiffJetty");
		WebAppContext ctx = new WebAppContext();
		ctx.setServer(server);
		ctx.setContextPath("/webapp");
		ctx.setWar("./WebContent");
		server.addHandler(ctx);
		server.start();
		System.out.println("Server Started");
		server.join();
	}
}
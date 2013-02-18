package com.raju;

import java.io.IOException;
import java.io.PrintWriter;
//import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONException;

public class DiffServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html");
		response.setHeader("Access-Control-Allow-Origin", "*");
		String input1 = request.getParameter("input1");
		String input2 = request.getParameter("input2");
		int context = 3;
		//int context = Integer.parseInt(request.getParameter("context"));
		JSONArray array = new JSONArray();
		Object[] obj1 = null, obj2 = null;
		try {
			obj1 = new Object[new JSONArray(input1).length()];
			obj2 = new Object[new JSONArray(input2).length()];
			obj1 = createJSON(input1, obj1);
			obj2 = createJSON(input2, obj2);
			PrintWriter out = response.getWriter();
			array = new FileDiff().compare(obj1, obj2, out, context);
			out.println(array);
		} catch (Exception e1) {
		}

	}

	public Object[] createJSON(String input, Object[] obj) throws JSONException {
		JSONArray array = null;
		array = new JSONArray(input);
		for (int i = 0; i < array.length(); i++)
			obj[i] = array.get(i).toString();
		return obj;
	}
}

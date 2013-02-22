package com.raju;

import java.io.PrintWriter;
import org.json.JSONArray;
import org.json.JSONObject;
import org.suigeneris.jrcs.diff.simple.SimpleDiff;
import org.suigeneris.jrcs.diff.*;
import org.suigeneris.jrcs.diff.delta.*;

public class FileDiff {
	static Object[] previous;
	static Object[] revised;

	public JSONArray compare(Object[] obj1, Object[] obj2, PrintWriter out,
			int context) throws Exception {
		DiffAlgorithm algorithm = new SimpleDiff();
		JSONArray array = new JSONArray();
		previous = obj1;
		revised = obj2;
		Diff difference = new Diff(previous, algorithm);
		Revision rev = null;
		try {
			rev = difference.diff(revised);
		} catch (DifferentiationFailedException e) {
			e.printStackTrace();
		}
		array = printDiff(rev, obj1, obj2);
		return array;
	}

	public JSONArray printDiff(Revision rev, Object[] obj1, Object[] obj2)
			throws Exception {
		JSONArray array = new JSONArray();
		for (int i = 0; i < rev.size(); i++) {
			Delta delta = rev.getDelta(i);
			JSONObject obj = new JSONObject();
			obj.put("first1", delta.getOriginal().first());
			obj.put("last1", delta.getOriginal().last());
			obj.put("size1", delta.getOriginal().size());
			obj.put("first2", delta.getRevised().first());
			obj.put("last2", delta.getRevised().last());
			obj.put("size2", delta.getRevised().size());
			obj.put("json1", obj1);
			obj.put("json2", obj2);
			array.put(i, obj);
//			System.out.println("first=" + delta.getOriginal().first());
//			System.out.println("last=" + delta.getOriginal().last());
//			System.out.println("size=" + delta.getOriginal().size());
			System.out.println("delta=" + delta.toString());
		}
		return array;
	}
}
import java.io.*;

public class Sample2 {
	public static void main(String[] args) throws IOException {
		//new FileRead().readFile("Sample.java");
	}
	public void readFile(String filename) throws IOException {
		BufferedReader br = new BufferedReader(new FileReader(filename));
		String line;
		while ((line = br.readLine()) != null) {
			System.out.println("\ntest" + line);
		}
		br.close();
	}
	public int subtract(int a, int b) {
		return a - b;
	}
}
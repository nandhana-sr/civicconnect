import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.URI;
public class TestSpring {
    public static void main(String[] args) {
        Path p = Paths.get("uploads").toAbsolutePath().normalize();
        System.out.println("Absolute Path: " + p.toString());
        System.out.println("URI String: " + p.toUri().toString());
        
        String loc1 = "file:" + p.toString() + "/";
        String loc2 = p.toUri().toString() + (p.toUri().toString().endsWith("/") ? "" : "/");
        
        System.out.println("Spring AddResourceLoc 1: " + loc1);
        System.out.println("Spring AddResourceLoc 2: " + loc2);
    }
}

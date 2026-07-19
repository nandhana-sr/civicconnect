import java.nio.file.Path;
import java.nio.file.Paths;
public class Test {
    public static void main(String[] args) {
        Path p = Paths.get("uploads").toAbsolutePath().normalize();
        System.out.println(p.toUri().toString() + "/");
    }
}

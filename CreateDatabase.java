import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class CreateDatabase {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/postgres";
        String user = "postgres";
        String password = "laptop";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            // Check if database exists first to avoid exception? Actually create database if not exists is not supported directly in PG, so we try-catch.
            try {
                stmt.executeUpdate("CREATE DATABASE \"civicConnect\"");
                System.out.println("Database created successfully!");
            } catch(Exception e) {
                System.out.println("Database might already exist: " + e.getMessage());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

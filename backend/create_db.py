import psycopg2
from psycopg2 import sql

def create_database():
    try:
        # Connect to the default 'postgres' database
        conn = psycopg2.connect(
            dbname='postgres',
            user='TindiTech',
            password='Tindi@0110',
            host='localhost'
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Check if thriftshop exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname='thriftshop'")
        exists = cursor.fetchone()
        
        if not exists:
            print("Creating database 'thriftshop'...")
            cursor.execute(sql.SQL("CREATE DATABASE thriftshop"))
            print("Database 'thriftshop' created successfully.")
        else:
            print("Database 'thriftshop' already exists.")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_database()

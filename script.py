import os

def get_folder_structure(folder_path, indent=0):
    """Recursively prints the folder structure"""
    try:
        for item in os.listdir(folder_path):
            item_path = os.path.join(folder_path, item)
            if os.path.isdir(item_path):
                print("  " * indent + f"[DIR] {item}")
                get_folder_structure(item_path, indent + 1)
            else:
                print("  " * indent + f"[FILE] {item}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    folder_path = "tommyfx-beaury-shop"
    if os.path.exists(folder_path) and os.path.isdir(folder_path):
        print(f"\nStructure of '{folder_path}':")
        get_folder_structure(folder_path)
    else:
        print("Invalid folder path!")

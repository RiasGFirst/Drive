import os

def get_folder_size(folder_path):
    total_size = 0

    for dirpath, dirnames, filenames in os.walk(folder_path):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            total_size += os.path.getsize(filepath)

    # Convert bytes to megabytes (MB) or gigabytes (GB)
    mb_size = total_size / (1024 ** 2)  # 1 MB = 1024^2 bytes
    gb_size = total_size / (1024 ** 3)  # 1 GB = 1024^3 bytes

    if gb_size >= 1:
        return f"{gb_size:.2f} GB"
    else:
        return f"{mb_size:.2f} MB"

# Example usage:
folder_path = "/home/rias/Bureau/RiasCloud/Drive/drivefile/faeaf949-df4c-47f8-a57d-2e957d1c1039"
result = get_folder_size(folder_path)
print(f"Total size of files in the folder: {result}")

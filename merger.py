import os
import shutil

def append_files_to_posts(target_file, source_directory):
    # Create an 'excess' directory if it doesn't exist
    excess_directory = os.path.join(source_directory, 'excess')
    if not os.path.exists(excess_directory):
        os.makedirs(excess_directory)
    
    # Open the target file in append mode
    with open(target_file, 'a') as target_f:
        # Loop through all files in the source directory
        for filename in os.listdir(source_directory):
            if filename.endswith('.txt') and filename.startswith('https') and filename != os.path.basename(target_file):
                file_path = os.path.join(source_directory, filename)
                # Open each source file and append its content to the target file
                with open(file_path, 'r') as source_f:
                    content = source_f.read()
                    target_f.write(content + '\n')  # Append content and add a newline
                
                # Move the processed file to the 'excess' directory
                shutil.move(file_path, os.path.join(excess_directory, filename))
                print(f"Processed and moved: {filename}")

# Define the target file and source directory
source_directory = '/Users/riftka221/Downloads'  # Change this to your directory path
target_file = os.path.join(source_directory, 'posts.txt')

# Run the function
append_files_to_posts(target_file, source_directory)
print("All files processed.")

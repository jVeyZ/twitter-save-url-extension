import os
import shutil
import json

def append_files_to_json(target_json_file, source_directory):
    # Create an 'excess' directory if it doesn't exist
    excess_directory = os.path.join(source_directory, 'excess')
    if not os.path.exists(excess_directory):
        os.makedirs(excess_directory)
    
    # Load existing data from the target JSON file if it exists
    if os.path.exists(target_json_file):
        with open(target_json_file, 'r') as json_file:
            try:
                all_posts = json.load(json_file)
            except json.JSONDecodeError:
                all_posts = []
    else:
        all_posts = []
    
    # Loop through all files in the source directory
    for filename in os.listdir(source_directory):
        if filename.endswith('.txt') and filename.startswith('https') and filename != os.path.basename(target_json_file):
            file_path = os.path.join(source_directory, filename)
            
            with open(file_path, 'r') as source_f:
                content = source_f.read().strip()
                
                # Parse content assuming the first line is the tweet URL and the following lines are image URLs
                lines = content.split('\n')
                tweet_url = lines[0]
                image_urls = lines[1:] if len(lines) > 1 else []

                # Create a post dictionary
                post = {
                    'tweet_url': tweet_url,
                    'image_urls': image_urls
                }

                # Append the post to the list
                all_posts.append(post)
            
            # Move the processed file to the 'excess' directory
            shutil.move(file_path, os.path.join(excess_directory, filename))
            print(f"Processed and moved: {filename}")
    
    # Write the updated posts to the JSON file
    with open(target_json_file, 'w') as json_file:
        json.dump(all_posts, json_file, indent=4)
    print(f"Updated {target_json_file} with {len(all_posts)} posts.")

# Define the target JSON file and source directory
source_directory = '/Users/riftka221/Downloads'  # Change this to your directory path
target_json_file = os.path.join(source_directory, 'posts.json')

# Run the function
append_files_to_json(target_json_file, source_directory)
print("All files processed and saved to JSON.")

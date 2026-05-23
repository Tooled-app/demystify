#!/usr/bin/env python3
"""
Add coverImage to all posts in content-manifest.json that don't have one.
Uses category-appropriate Unsplash image URLs.
"""

import json
import sys

# Category-specific Unsplash images
CATEGORY_IMAGES = {
    "Confessional": [
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80",
        "https://images.unsplash.com/photo-1506452819137-0422416856b8?w=1200&q=80",
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80",
        "https://images.unsplash.com/photo-1558494949-ef526b0042a0?w=1200&q=80",
        "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80",
    ],
    "Quick Take": [
        "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1200&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80",
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&q=80",
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
        "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&q=80",
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    ],
    "AI": [
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80",
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80",
        "https://images.unsplash.com/photo-1558494949-ef526b0042a0?w=1200&q=80",
    ],
    "Reports": [
        "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80",
    ],
    "Deep Dive": [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80",
        "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1200&q=80",
    ],
}

DEFAULT_IMAGES = [
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80",
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80",
    "https://images.unsplash.com/photo-1558494949-ef526b0042a0?w=1200&q=80",
]

def get_image_for_post(post, index):
    """Get an appropriate cover image for a post."""
    category = post.get("category", "AI")
    
    # Use category-specific images if available
    if category in CATEGORY_IMAGES:
        images = CATEGORY_IMAGES[category]
        # Use index modulo to cycle through available images
        return images[index % len(images)]
    
    # Fallback to default images
    return DEFAULT_IMAGES[index % len(DEFAULT_IMAGES)]

def main():
    manifest_path = "data/content-manifest.json"
    
    with open(manifest_path, "r") as f:
        posts = json.load(f)
    
    added_count = 0
    existing_count = 0
    
    # Track used images per category to avoid duplicates where possible
    category_indices = {}
    
    for i, post in enumerate(posts):
        if "coverImage" in post and post["coverImage"]:
            existing_count += 1
            continue
        
        category = post.get("category", "AI")
        if category not in category_indices:
            category_indices[category] = 0
        
        post["coverImage"] = get_image_for_post(post, category_indices[category])
        category_indices[category] += 1
        added_count += 1
    
    with open(manifest_path, "w") as f:
        json.dump(posts, f, indent=2)
    
    print(f"Cover images: {existing_count} already had, {added_count} added")
    print(f"Total posts: {len(posts)}")

if __name__ == "__main__":
    main()

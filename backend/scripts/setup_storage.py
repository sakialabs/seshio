#!/usr/bin/env python3
"""
Supabase Storage Setup Script

This script creates and configures the Supabase Storage bucket for material uploads.
It can be run manually or as part of the deployment process.

Requirements: 4.1, 13.1
"""

import os
import sys
from supabase import create_client, Client

def setup_storage_bucket():
    """
    Set up the Supabase Storage bucket for materials
    
    Creates a bucket with:
    - Name: 'materials'
    - Public: False (authenticated users only)
    - File size limit: 50MB
    - Allowed MIME types: PDF, txt, md, docx
    """
    # Get Supabase credentials from environment
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_URL and SUPABASE_KEY environment variables must be set")
        sys.exit(1)
    
    # Create Supabase client
    supabase: Client = create_client(supabase_url, supabase_key)
    
    try:
        # Check if bucket already exists
        buckets = supabase.storage.list_buckets()
        bucket_exists = any(bucket.get('name') == 'materials' for bucket in buckets)
        
        if bucket_exists:
            print("✓ Storage bucket 'materials' already exists")
            
            # Update bucket configuration
            supabase.storage.update_bucket(
                'materials',
                {
                    'public': False,
                    'file_size_limit': 52428800,  # 50MB
                    'allowed_mime_types': [
                        'application/pdf',
                        'text/plain',
                        'text/markdown',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ]
                }
            )
            print("✓ Updated bucket configuration")
        else:
            # Create new bucket
            supabase.storage.create_bucket(
                'materials',
                {
                    'public': False,
                    'file_size_limit': 52428800,  # 50MB
                    'allowed_mime_types': [
                        'application/pdf',
                        'text/plain',
                        'text/markdown',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ]
                }
            )
            print("✓ Created storage bucket 'materials'")
        
        print("\nStorage bucket setup complete!")
        print("\nBucket configuration:")
        print("  - Name: materials")
        print("  - Public: No (authenticated users only)")
        print("  - File size limit: 50MB")
        print("  - Allowed types: PDF, txt, md, docx")
        print("\nNote: Storage policies must be configured via SQL (see setup_storage.sql)")
        
    except Exception as e:
        print(f"Error setting up storage bucket: {e}")
        sys.exit(1)


if __name__ == "__main__":
    setup_storage_bucket()

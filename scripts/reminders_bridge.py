#!/usr/bin/env python3
"""
Orbit - Apple Reminders Bridge Script

This script syncs rules from Apple Reminders to the Orbit Vercel API.
It runs locally on macOS and uses AppleScript to access Reminders data.

Usage:
    python reminders_bridge.py

Environment Variables:
    VERCEL_API_URL - The Vercel API endpoint (e.g., https://your-app.vercel.app/api/sync-rules)
    API_SECRET_KEY - Bearer token for authentication
"""

import subprocess
import json
import os
import time
from datetime import datetime
from typing import List, Dict
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
VERCEL_API_URL = os.getenv('VERCEL_API_URL')
API_SECRET_KEY = os.getenv('API_SECRET_KEY')
REMINDERS_LIST_NAME = "Orbit Rules"
SYNC_INTERVAL_MINUTES = 30

# Validation
if not VERCEL_API_URL:
    raise ValueError("VERCEL_API_URL environment variable is required")
if not API_SECRET_KEY:
    raise ValueError("API_SECRET_KEY environment variable is required")


def run_applescript(script: str) -> str:
    """
    Execute AppleScript and return the output
    
    Args:
        script: AppleScript code to execute
        
    Returns:
        Output from the AppleScript execution
    """
    try:
        result = subprocess.run(
            ['osascript', '-e', script],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"❌ AppleScript error: {e.stderr}")
        raise


def fetch_reminders() -> List[Dict[str, str]]:
    """
    Fetch reminders from the specified list using AppleScript
    
    Returns:
        List of reminder dictionaries with title, notes, and ID
    """
    applescript = f'''
    tell application "Reminders"
        set remindersList to list "{REMINDERS_LIST_NAME}"
        set reminderData to {{}}
        
        repeat with aReminder in (reminders of remindersList)
            set reminderTitle to name of aReminder
            set reminderNotes to body of aReminder
            set reminderId to id of aReminder
            
            set end of reminderData to reminderTitle & "|" & reminderNotes & "|" & reminderId
        end repeat
        
        return reminderData
    end tell
    '''
    
    try:
        output = run_applescript(applescript)
        
        if not output:
            print(f"ℹ️ No reminders found in list '{REMINDERS_LIST_NAME}'")
            return []
        
        # Parse the output
        reminders = []
        for line in output.split(', '):
            parts = line.split('|')
            if len(parts) >= 3:
                reminders.append({
                    'rule_name': parts[0].strip(),
                    'criteria_logic': parts[1].strip() if parts[1] else '',
                    'source_id': parts[2].strip()
                })
        
        return reminders
        
    except Exception as e:
        print(f"❌ Error fetching reminders: {e}")
        return []


def sync_to_api(reminders: List[Dict[str, str]]) -> bool:
    """
    Send reminders data to the Vercel API
    
    Args:
        reminders: List of reminder dictionaries
        
    Returns:
        True if sync was successful, False otherwise
    """
    if not reminders:
        print("⚠️  No reminders to sync")
        return True
    
    payload = {
        'sync_timestamp': datetime.utcnow().isoformat() + 'Z',
        'rules': reminders
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {API_SECRET_KEY}'
    }
    
    try:
        print(f"📤 Syncing {len(reminders)} rules to {VERCEL_API_URL}...")
        
        response = requests.post(
            VERCEL_API_URL,
            json=payload,
            headers=headers,
            timeout=30
        )
        
        response.raise_for_status()
        
        result = response.json()
        print(f"✅ Sync successful: {result.get('message', 'OK')}")
        return True
        
    except requests.exceptions.Timeout:
        print("❌ Sync failed: Request timeout")
        return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Sync failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_detail = e.response.json()
                print(f"   Error details: {error_detail}")
            except:
                print(f"   Response: {e.response.text}")
        return False


def main_loop():
    """
    Main sync loop that runs continuously
    """
    print("🚀 Orbit Reminders Bridge started")
    print(f"   Syncing list: '{REMINDERS_LIST_NAME}'")
    print(f"   Interval: {SYNC_INTERVAL_MINUTES} minutes")
    print(f"   API endpoint: {VERCEL_API_URL}")
    print("")
    
    while True:
        try:
            print(f"🔄 Starting sync at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
            # Fetch reminders
            reminders = fetch_reminders()
            print(f"📋 Found {len(reminders)} reminders")
            
            # Sync to API
            sync_to_api(reminders)
            
            # Wait for next sync
            print(f"⏳ Next sync in {SYNC_INTERVAL_MINUTES} minutes\n")
            time.sleep(SYNC_INTERVAL_MINUTES * 60)
            
        except KeyboardInterrupt:
            print("\n👋 Shutting down gracefully...")
            break
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            print(f"   Retrying in {SYNC_INTERVAL_MINUTES} minutes...\n")
            time.sleep(SYNC_INTERVAL_MINUTES * 60)


if __name__ == '__main__':
    main_loop()

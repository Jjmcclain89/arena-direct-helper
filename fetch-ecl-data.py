#!/usr/bin/env python3
"""
Fetch ECL (Eclipsion) card data from Scryfall and 17Lands APIs.
Generates ecl-data.json with card information and winrate statistics.

Usage:
    python fetch-ecl-data.py [--start-date YYYY-MM-DD] [--end-date YYYY-MM-DD]

If dates are not provided, uses all available data up to today.
"""

import requests
import json
import time
from datetime import datetime, timedelta
import argparse

# Configuration
SET_CODE = "ECL"
OUTPUT_FILE = "src/data/ecl-data.json"
SCRYFALL_API = "https://api.scryfall.com"
SEVENTEEN_LANDS_API = "https://www.17lands.com/card_ratings/data"

def fetch_scryfall_cards(set_code):
    """Fetch all cards from a set using Scryfall API with pagination."""
    print(f"Fetching cards from Scryfall for set {set_code}...")

    all_cards = []
    url = f"{SCRYFALL_API}/cards/search?q=set:{set_code}&unique=prints"

    while url:
        response = requests.get(url)
        if response.status_code != 200:
            print(f"Error fetching from Scryfall: {response.status_code}")
            return []

        data = response.json()
        all_cards.extend(data.get('data', []))

        # Get next page URL if it exists
        url = data.get('next_page')

        # Be nice to Scryfall's API
        if url:
            time.sleep(0.1)

    print(f"Found {len(all_cards)} cards from Scryfall")
    return all_cards

def fetch_17lands_data(set_code, start_date, end_date):
    """Fetch winrate data from 17Lands."""
    print(f"Fetching 17Lands data for {set_code} from {start_date} to {end_date}...")

    params = {
        'expansion': set_code,
        'event_type': 'PremierDraft',
        'start_date': start_date,
        'end_date': end_date
    }

    response = requests.get(SEVENTEEN_LANDS_API, params=params)
    if response.status_code != 200:
        print(f"Error fetching from 17Lands: {response.status_code}")
        return {}

    data = response.json()

    # Create a map of card name to winrate
    winrate_map = {}
    for card in data:
        name = card.get('name')
        gih_wr = card.get('ever_drawn_win_rate')
        if name and gih_wr is not None:
            # Convert to percentage (0-100)
            winrate_map[name] = gih_wr * 100

    print(f"Found winrate data for {len(winrate_map)} cards")
    return winrate_map

def get_mana_cost(card):
    """Extract mana cost from Scryfall card data."""
    # Handle split/adventure/modal cards
    if 'card_faces' in card:
        # Use the front face's mana cost
        return card['card_faces'][0].get('mana_cost', '')
    return card.get('mana_cost', '')

def get_rarity(card):
    """Extract rarity from Scryfall card data."""
    rarity = card.get('rarity', 'common')
    # Capitalize first letter
    return rarity.capitalize()

def get_image_url(card):
    """Extract card image URL from Scryfall card data."""
    # Try normal size first, fall back to small
    if 'image_uris' in card:
        return card['image_uris'].get('normal', card['image_uris'].get('small', ''))
    elif 'card_faces' in card:
        # For double-faced cards, use front face
        return card['card_faces'][0].get('image_uris', {}).get('normal', '')
    return ''

def merge_data(scryfall_cards, winrate_map):
    """Merge Scryfall and 17Lands data."""
    print("Merging data...")

    cards = []
    for card in scryfall_cards:
        name = card['name']

        # Skip tokens, special versions, etc.
        if card.get('layout') in ['token', 'emblem', 'art_series']:
            continue

        card_data = {
            'Name': name,
            'Rarity': get_rarity(card),
            'Cost': get_mana_cost(card),
            'GihWinrate': winrate_map.get(name),  # Will be null if not found
            'Expansion': SET_CODE,
            'CastingCost': get_mana_cost(card),
            'ImageUrl': get_image_url(card)
        }

        cards.append(card_data)

    # Sort by name
    cards.sort(key=lambda x: x['Name'])

    # Count cards with winrate data
    with_winrate = sum(1 for c in cards if c['GihWinrate'] is not None)
    print(f"Merged {len(cards)} cards ({with_winrate} with winrate data)")

    return cards

def main():
    parser = argparse.ArgumentParser(description='Fetch ECL card data')
    parser.add_argument('--start-date', type=str,
                       help='Start date for 17Lands data (YYYY-MM-DD)')
    parser.add_argument('--end-date', type=str,
                       help='End date for 17Lands data (YYYY-MM-DD)')

    args = parser.parse_args()

    # Default to all data since 2 days ago if not provided
    if args.end_date:
        end_date = args.end_date
    else:
        end_date = datetime.now().strftime('%Y-%m-%d')

    if args.start_date:
        start_date = args.start_date
    else:
        # Use a date far in the past to get all available data
        start_date = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')

    print(f"Fetching ECL data for date range: {start_date} to {end_date}")

    # Fetch data from both sources
    scryfall_cards = fetch_scryfall_cards(SET_CODE)
    if not scryfall_cards:
        print("Failed to fetch Scryfall data. Exiting.")
        return

    winrate_map = fetch_17lands_data(SET_CODE, start_date, end_date)

    # Merge the data
    cards = merge_data(scryfall_cards, winrate_map)

    # Write to file
    output = {'cards': cards}
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\nSuccessfully wrote {len(cards)} cards to {OUTPUT_FILE}")
    print(f"Cards with winrate data: {sum(1 for c in cards if c['GihWinrate'] is not None)}")
    print(f"Cards without winrate data: {sum(1 for c in cards if c['GihWinrate'] is None)}")

if __name__ == '__main__':
    main()

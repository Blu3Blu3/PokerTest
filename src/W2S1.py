# Christian Guiang
# 6 9 2026
# Week 2, Session 1

### SET 1 ###

# 1. Festival lineup
def lineup(artists, set_times):
    lineup = {}
    for a in range(len(artists)):
        lineup[artists[a]] = set_times[a]
    return lineup

artists1 = ["Kendrick Lamar", "Chappell Roan", "Mitski", "Rosalia"]
set_times1 = ["9:30 PM", "5:00 PM", "2:00 PM", "7:30 PM"]

# 2. Planning App
# Edge cases: empty dictionary for festival schedule?
def get_artist_info(artist, festival_schedule):
    return festival_schedule.get(artist, {"message" : "Artist not found"})

# 3. Ticket sales
def total_sales(ticket_sales):
    return sum(ticket_sales.values())

# 4. Scheduling conflict
def identify_conflicts(venue1_schedule, venue2_schedule):
    ret = {}
    for artist in venue1_schedule.keys():
        if artist in venue2_schedule.keys():
            if venue1_schedule.get(artist) == venue2_schedule.get(artist):
                ret[artist] = venue1_schedule.get(artist)
    return ret

# 5. Best Set
# Edge cases: empty list, tie (pick the first)
# First, keep a dictionary of artists and their votes.
# Then, once all votes are tallied in that, find the maximum and return its corresponding artist (or the first found if tied).
def best_set(votes):
    artist_count = {}
    for artist in votes.values():
        artist_count[artist] = artist_count.get(artist, 0) + 1
    # Not sure why this throws an error but it works...
    return max(artist_count, key=artist_count.get)
    max

# 6. Performances
def max_audience_performances(audiences):
    return max(audiences)
        


# Test down here

votes1 = {
    1234: "SZA", 
    1235: "Yo-Yo Ma",
    1236: "Ethel Cain",
    1237: "Ethel Cain",
    1238: "SZA",
    1239: "SZA"
}

votes2 = {
    1234: "SZA", 
    1235: "Yo-Yo Ma",
    1236: "Ethel Cain",
    1237: "Ethel Cain",
    1238: "SZA"
}

print(best_set(votes1))
print(best_set(votes2))
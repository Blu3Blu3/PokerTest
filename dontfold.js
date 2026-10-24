/*
    Christian Guiang
    October 21, 2026

    A set of functions for identifying the best playable poker hand in a set of 5 playing cards, and rewarding that hand points.
    Hands are given in an array "poker_hands", and have attributes "hand_id" (int) and "cards" (list of Card objects
    with attributes "rank" (string) and "suit" (string)).

    Hands are to be scored with the following points:
    
    High Card: 1
    Pair: 2
    Two Pair: 4
    Three of a Kind: 8
    Straight: 16
    Flush: 32
    Full House: 64
    Four of a Kind: 128
    Straight Flush: 256
    Royal Flush: 512

    Rank and suit are not going to be judged in scoring, but it would make for a nice miscellaneous feature here.
    Same goes for adding the impossible hands created by cheating, like Five of a Kind or Flush House.

    -----
    My first thoughts for building a scoring function involve finding the "of a kind" card groups, ranging from pair to 4OAK.
    This is because the set of possible hands can be split into those with an OAK group and those without, which in turn lets
    the check for playable hands be split into two parts. Immediately, this cuts out the need to try finding every playable hand
    in a given poker hand. From there, finding the best playable hand becomes a matter of applying checks for the most valuable hands first, and working
    down until a match is found. 

    Looking at it further, every check seems easily doable by using a frequency map for rank, save for checking for flushes.
    
    - ny hand with an OAK group is defined by the max frequency of any one rank, and for full houses, if there are exactly 2 ranks
    with frequencies 3 and 2, respectively.
    - Any hand with a straight is defined by 5 ranks with frequencies of 1, and contiguity.
    - Any hand with a flush just has all cards = the same suit, for which a map is definitely overkill.

    Once all that's in place, the main scoring function could go like this, given a hand "hand":
    Let freq_ranks store the frequencies of each found rank in the hand.
    Let max_rank = the rank appearing most in the hand, with ties broken by value (ex. "seven" over "three", "Ace" over "King").
    If freq_ranks[max_rank] > 1:
        If freq_ranks[max_rank] == 4, it's a 4OAK (128 points).
        If freq_ranks[max_rank] == 3:
            If there's a different rank with a frequency of 2, it's a Full House (64 points).
            Otherwise, it's just a 3OAK (8 points).
        If freq_ranks[max_rank] == 2:
            If there's a different rank with a frequency of 2, it's a Two Pair (4 points).
            Otherwise, it's just a Pair (2 points).
    Otherwise, check for everything else.
        If all card suits are the same:
            If all frequencies in freq_ranks == 1 and all keys are adjacent:
                If max_rank == "Ace", it's a Royal Flush (512 points).
                Otherwise, it's a Straight Flush (256 points).
            Otherwise, it's just a Flush (32 points).
        If all frequencies in freq_ranks == 1:
            If all keys are adjacent, it's a Straight (16 points).
            Otherwise, it's just a High Card (1 point).

    Of course, if you go for the stretch goals of adding the impossible hands, they're also just extra conditions.
*/

// TODO: Figure out why fetch requests are getting blocked. The console errors said that CSOR requests from origin "null" are
//       disallowed, but I don't know what that means yet.
//const hands = fetch("./dont-fold-test-hands.json").poker_hands

const hands = {
  "poker_hands": [
    {
      "hand_id": 1,
      "cards": [
        { "rank": "seven", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "three", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Diamonds" },
        { "rank": "nine", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 2,
      "cards": [
        { "rank": "five", "suit": "Diamonds" },
        { "rank": "King", "suit": "Diamonds" },
        { "rank": "six", "suit": "Diamonds" },
        { "rank": "eight", "suit": "Hearts" },
        { "rank": "ten", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 3,
      "cards": [
        { "rank": "King", "suit": "Spades" },
        { "rank": "seven", "suit": "Hearts" },
        { "rank": "Queen", "suit": "Hearts" },
        { "rank": "five", "suit": "Clubs" },
        { "rank": "nine", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 4,
      "cards": [
        { "rank": "Queen", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Diamonds" },
        { "rank": "Queen", "suit": "Diamonds" },
        { "rank": "four", "suit": "Spades" },
        { "rank": "Queen", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 5,
      "cards": [
        { "rank": "Jack", "suit": "Diamonds" },
        { "rank": "ten", "suit": "Diamonds" },
        { "rank": "Queen", "suit": "Diamonds" },
        { "rank": "King", "suit": "Diamonds" },
        { "rank": "Ace", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 6,
      "cards": [
        { "rank": "three", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Clubs" },
        { "rank": "six", "suit": "Clubs" },
        { "rank": "six", "suit": "Spades" },
        { "rank": "six", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 7,
      "cards": [
        { "rank": "Queen", "suit": "Diamonds" },
        { "rank": "Ace", "suit": "Diamonds" },
        { "rank": "seven", "suit": "Clubs" },
        { "rank": "ten", "suit": "Hearts" },
        { "rank": "five", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 8,
      "cards": [
        { "rank": "nine", "suit": "Hearts" },
        { "rank": "four", "suit": "Spades" },
        { "rank": "eight", "suit": "Hearts" },
        { "rank": "five", "suit": "Diamonds" },
        { "rank": "nine", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 9,
      "cards": [
        { "rank": "ten", "suit": "Spades" },
        { "rank": "ten", "suit": "Clubs" },
        { "rank": "three", "suit": "Clubs" },
        { "rank": "seven", "suit": "Hearts" },
        { "rank": "seven", "suit": "Clubs" }
      ]
    },
    {
      "hand_id": 10,
      "cards": [
        { "rank": "King", "suit": "Hearts" },
        { "rank": "five", "suit": "Spades" },
        { "rank": "five", "suit": "Hearts" },
        { "rank": "two", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 11,
      "cards": [
        { "rank": "ten", "suit": "Hearts" },
        { "rank": "eight", "suit": "Clubs" },
        { "rank": "nine", "suit": "Spades" },
        { "rank": "Jack", "suit": "Diamonds" },
        { "rank": "Queen", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 12,
      "cards": [
        { "rank": "ten", "suit": "Hearts" },
        { "rank": "eight", "suit": "Spades" },
        { "rank": "eight", "suit": "Diamonds" },
        { "rank": "Jack", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 13,
      "cards": [
        { "rank": "King", "suit": "Spades" },
        { "rank": "King", "suit": "Diamonds" },
        { "rank": "two", "suit": "Spades" },
        { "rank": "two", "suit": "Clubs" },
        { "rank": "ten", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 14,
      "cards": [
        { "rank": "six", "suit": "Hearts" },
        { "rank": "eight", "suit": "Spades" },
        { "rank": "two", "suit": "Diamonds" },
        { "rank": "six", "suit": "Clubs" },
        { "rank": "four", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 15,
      "cards": [
        { "rank": "four", "suit": "Spades" },
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "six", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Diamonds" },
        { "rank": "four", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 16,
      "cards": [
        { "rank": "Ace", "suit": "Clubs" },
        { "rank": "four", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Diamonds" },
        { "rank": "eight", "suit": "Clubs" },
        { "rank": "four", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 17,
      "cards": [
        { "rank": "two", "suit": "Diamonds" },
        { "rank": "eight", "suit": "Spades" },
        { "rank": "four", "suit": "Diamonds" },
        { "rank": "Queen", "suit": "Spades" },
        { "rank": "six", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 18,
      "cards": [
        { "rank": "Queen", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Clubs" },
        { "rank": "ten", "suit": "Diamonds" },
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 19,
      "cards": [
        { "rank": "eight", "suit": "Spades" },
        { "rank": "seven", "suit": "Spades" },
        { "rank": "seven", "suit": "Clubs" },
        { "rank": "Queen", "suit": "Clubs" },
        { "rank": "seven", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 20,
      "cards": [
        { "rank": "Ace", "suit": "Spades" },
        { "rank": "ten", "suit": "Clubs" },
        { "rank": "King", "suit": "Spades" },
        { "rank": "ten", "suit": "Diamonds" },
        { "rank": "seven", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 21,
      "cards": [
        { "rank": "ten", "suit": "Hearts" },
        { "rank": "King", "suit": "Spades" },
        { "rank": "Ace", "suit": "Diamonds" },
        { "rank": "Queen", "suit": "Diamonds" },
        { "rank": "Jack", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 22,
      "cards": [
        { "rank": "Queen", "suit": "Hearts" },
        { "rank": "five", "suit": "Clubs" },
        { "rank": "eight", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "three", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 23,
      "cards": [
        { "rank": "six", "suit": "Diamonds" },
        { "rank": "six", "suit": "Spades" },
        { "rank": "nine", "suit": "Diamonds" },
        { "rank": "ten", "suit": "Diamonds" },
        { "rank": "six", "suit": "Clubs" }
      ]
    },
    {
      "hand_id": 24,
      "cards": [
        { "rank": "Queen", "suit": "Clubs" },
        { "rank": "King", "suit": "Clubs" },
        { "rank": "Ace", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Spades" },
        { "rank": "ten", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 25,
      "cards": [
        { "rank": "three", "suit": "Clubs" },
        { "rank": "seven", "suit": "Clubs" },
        { "rank": "ten", "suit": "Diamonds" },
        { "rank": "Queen", "suit": "Hearts" },
        { "rank": "three", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 26,
      "cards": [
        { "rank": "ten", "suit": "Spades" },
        { "rank": "five", "suit": "Spades" },
        { "rank": "Queen", "suit": "Hearts" },
        { "rank": "King", "suit": "Spades" },
        { "rank": "Jack", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 27,
      "cards": [
        { "rank": "nine", "suit": "Clubs" },
        { "rank": "seven", "suit": "Diamonds" },
        { "rank": "two", "suit": "Clubs" },
        { "rank": "seven", "suit": "Spades" },
        { "rank": "two", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 28,
      "cards": [
        { "rank": "six", "suit": "Hearts" },
        { "rank": "five", "suit": "Hearts" },
        { "rank": "ten", "suit": "Diamonds" },
        { "rank": "six", "suit": "Spades" },
        { "rank": "Ace", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 29,
      "cards": [
        { "rank": "seven", "suit": "Diamonds" },
        { "rank": "four", "suit": "Clubs" },
        { "rank": "Queen", "suit": "Diamonds" },
        { "rank": "eight", "suit": "Clubs" },
        { "rank": "eight", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 30,
      "cards": [
        { "rank": "seven", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Clubs" },
        { "rank": "ten", "suit": "Clubs" },
        { "rank": "Ace", "suit": "Clubs" },
        { "rank": "King", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 31,
      "cards": [
        { "rank": "eight", "suit": "Hearts" },
        { "rank": "Ace", "suit": "Hearts" },
        { "rank": "King", "suit": "Diamonds" },
        { "rank": "nine", "suit": "Diamonds" },
        { "rank": "Ace", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 32,
      "cards": [
        { "rank": "five", "suit": "Diamonds" },
        { "rank": "seven", "suit": "Clubs" },
        { "rank": "Ace", "suit": "Diamonds" },
        { "rank": "five", "suit": "Hearts" },
        { "rank": "Queen", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 33,
      "cards": [
        { "rank": "ten", "suit": "Hearts" },
        { "rank": "six", "suit": "Clubs" },
        { "rank": "two", "suit": "Clubs" },
        { "rank": "eight", "suit": "Spades" },
        { "rank": "five", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 34,
      "cards": [
        { "rank": "eight", "suit": "Spades" },
        { "rank": "four", "suit": "Spades" },
        { "rank": "seven", "suit": "Spades" },
        { "rank": "five", "suit": "Spades" },
        { "rank": "six", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 35,
      "cards": [
        { "rank": "nine", "suit": "Hearts" },
        { "rank": "Ace", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Spades" },
        { "rank": "two", "suit": "Hearts" },
        { "rank": "nine", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 36,
      "cards": [
        { "rank": "three", "suit": "Clubs" },
        { "rank": "two", "suit": "Clubs" },
        { "rank": "Ace", "suit": "Clubs" },
        { "rank": "five", "suit": "Clubs" },
        { "rank": "four", "suit": "Clubs" }
      ]
    },
    {
      "hand_id": 37,
      "cards": [
        { "rank": "seven", "suit": "Hearts" },
        { "rank": "Queen", "suit": "Hearts" },
        { "rank": "three", "suit": "Diamonds" },
        { "rank": "Queen", "suit": "Clubs" },
        { "rank": "seven", "suit": "Clubs" }
      ]
    },
    {
      "hand_id": 38,
      "cards": [
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "five", "suit": "Diamonds" },
        { "rank": "Ace", "suit": "Diamonds" },
        { "rank": "Jack", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 39,
      "cards": [
        { "rank": "Ace", "suit": "Spades" },
        { "rank": "two", "suit": "Hearts" },
        { "rank": "eight", "suit": "Clubs" },
        { "rank": "ten", "suit": "Diamonds" },
        { "rank": "Jack", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 40,
      "cards": [
        { "rank": "Ace", "suit": "Hearts" },
        { "rank": "ten", "suit": "Hearts" },
        { "rank": "King", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "Queen", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 41,
      "cards": [
        { "rank": "eight", "suit": "Clubs" },
        { "rank": "Queen", "suit": "Hearts" },
        { "rank": "two", "suit": "Hearts" },
        { "rank": "four", "suit": "Spades" },
        { "rank": "Queen", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 42,
      "cards": [
        { "rank": "three", "suit": "Diamonds" },
        { "rank": "five", "suit": "Diamonds" },
        { "rank": "six", "suit": "Diamonds" },
        { "rank": "four", "suit": "Diamonds" },
        { "rank": "seven", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 43,
      "cards": [
        { "rank": "Ace", "suit": "Diamonds" },
        { "rank": "four", "suit": "Clubs" },
        { "rank": "three", "suit": "Hearts" },
        { "rank": "two", "suit": "Diamonds" },
        { "rank": "five", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 44,
      "cards": [
        { "rank": "Ace", "suit": "Hearts" },
        { "rank": "nine", "suit": "Spades" },
        { "rank": "Jack", "suit": "Spades" },
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "seven", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 45,
      "cards": [
        { "rank": "Queen", "suit": "Spades" },
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "eight", "suit": "Hearts" },
        { "rank": "nine", "suit": "Spades" },
        { "rank": "ten", "suit": "Clubs" }
      ]
    },
    {
      "hand_id": 46,
      "cards": [
        { "rank": "nine", "suit": "Spades" },
        { "rank": "nine", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Clubs" },
        { "rank": "four", "suit": "Spades" },
        { "rank": "two", "suit": "Clubs" }
      ]
    },
    {
      "hand_id": 47,
      "cards": [
        { "rank": "five", "suit": "Hearts" },
        { "rank": "four", "suit": "Diamonds" },
        { "rank": "seven", "suit": "Spades" },
        { "rank": "ten", "suit": "Clubs" },
        { "rank": "Ace", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 48,
      "cards": [
        { "rank": "Jack", "suit": "Spades" },
        { "rank": "Jack", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Diamonds" },
        { "rank": "three", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 49,
      "cards": [
        { "rank": "Ace", "suit": "Spades" },
        { "rank": "five", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Spades" },
        { "rank": "Ace", "suit": "Diamonds" },
        { "rank": "King", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 50,
      "cards": [
        { "rank": "eight", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Clubs" },
        { "rank": "King", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 51,
      "cards": [
        { "rank": "nine", "suit": "Diamonds" },
        { "rank": "Ace", "suit": "Hearts" },
        { "rank": "five", "suit": "Spades" },
        { "rank": "Jack", "suit": "Diamonds" },
        { "rank": "two", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 52,
      "cards": [
        { "rank": "Queen", "suit": "Spades" },
        { "rank": "seven", "suit": "Spades" },
        { "rank": "two", "suit": "Hearts" },
        { "rank": "seven", "suit": "Diamonds" },
        { "rank": "Ace", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 53,
      "cards": [
        { "rank": "ten", "suit": "Clubs" },
        { "rank": "six", "suit": "Clubs" },
        { "rank": "six", "suit": "Diamonds" },
        { "rank": "ten", "suit": "Hearts" },
        { "rank": "Ace", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 54,
      "cards": [
        { "rank": "three", "suit": "Spades" },
        { "rank": "King", "suit": "Clubs" },
        { "rank": "three", "suit": "Diamonds" },
        { "rank": "four", "suit": "Diamonds" },
        { "rank": "three", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 55,
      "cards": [
        { "rank": "five", "suit": "Hearts" },
        { "rank": "six", "suit": "Hearts" },
        { "rank": "eight", "suit": "Hearts" },
        { "rank": "seven", "suit": "Hearts" },
        { "rank": "four", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 56,
      "cards": [
        { "rank": "Jack", "suit": "Spades" },
        { "rank": "Jack", "suit": "Diamonds" },
        { "rank": "ten", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Clubs" },
        { "rank": "ten", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 57,
      "cards": [
        { "rank": "five", "suit": "Hearts" },
        { "rank": "two", "suit": "Hearts" },
        { "rank": "King", "suit": "Hearts" },
        { "rank": "six", "suit": "Hearts" },
        { "rank": "four", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 58,
      "cards": [
        { "rank": "five", "suit": "Hearts" },
        { "rank": "Queen", "suit": "Diamonds" },
        { "rank": "King", "suit": "Clubs" },
        { "rank": "five", "suit": "Spades" },
        { "rank": "King", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 59,
      "cards": [
        { "rank": "Ace", "suit": "Spades" },
        { "rank": "seven", "suit": "Spades" },
        { "rank": "Ace", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "four", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 60,
      "cards": [
        { "rank": "King", "suit": "Clubs" },
        { "rank": "King", "suit": "Diamonds" },
        { "rank": "five", "suit": "Diamonds" },
        { "rank": "two", "suit": "Hearts" },
        { "rank": "King", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 61,
      "cards": [
        { "rank": "Queen", "suit": "Spades" },
        { "rank": "ten", "suit": "Hearts" },
        { "rank": "King", "suit": "Hearts" },
        { "rank": "Ace", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 62,
      "cards": [
        { "rank": "six", "suit": "Hearts" },
        { "rank": "four", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Clubs" },
        { "rank": "Ace", "suit": "Hearts" },
        { "rank": "seven", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 63,
      "cards": [
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "Queen", "suit": "Diamonds" },
        { "rank": "ten", "suit": "Spades" },
        { "rank": "Ace", "suit": "Spades" },
        { "rank": "King", "suit": "Clubs" }
      ]
    },
    {
      "hand_id": 64,
      "cards": [
        { "rank": "seven", "suit": "Clubs" },
        { "rank": "Queen", "suit": "Clubs" },
        { "rank": "Queen", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Clubs" },
        { "rank": "six", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 65,
      "cards": [
        { "rank": "Jack", "suit": "Spades" },
        { "rank": "five", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "King", "suit": "Diamonds" },
        { "rank": "two", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 66,
      "cards": [
        { "rank": "eight", "suit": "Diamonds" },
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Spades" },
        { "rank": "five", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 67,
      "cards": [
        { "rank": "eight", "suit": "Clubs" },
        { "rank": "nine", "suit": "Clubs" },
        { "rank": "ten", "suit": "Clubs" },
        { "rank": "Queen", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Clubs" }
      ]
    },
    {
      "hand_id": 68,
      "cards": [
        { "rank": "eight", "suit": "Spades" },
        { "rank": "four", "suit": "Diamonds" },
        { "rank": "Ace", "suit": "Clubs" },
        { "rank": "nine", "suit": "Clubs" },
        { "rank": "nine", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 69,
      "cards": [
        { "rank": "four", "suit": "Hearts" },
        { "rank": "eight", "suit": "Hearts" },
        { "rank": "Ace", "suit": "Hearts" },
        { "rank": "five", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 70,
      "cards": [
        { "rank": "eight", "suit": "Hearts" },
        { "rank": "four", "suit": "Hearts" },
        { "rank": "two", "suit": "Hearts" },
        { "rank": "six", "suit": "Hearts" },
        { "rank": "King", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 71,
      "cards": [
        { "rank": "five", "suit": "Spades" },
        { "rank": "two", "suit": "Clubs" },
        { "rank": "five", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "ten", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 72,
      "cards": [
        { "rank": "King", "suit": "Spades" },
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "King", "suit": "Hearts" },
        { "rank": "King", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 73,
      "cards": [
        { "rank": "Queen", "suit": "Spades" },
        { "rank": "ten", "suit": "Spades" },
        { "rank": "Jack", "suit": "Spades" },
        { "rank": "King", "suit": "Spades" },
        { "rank": "Ace", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 74,
      "cards": [
        { "rank": "five", "suit": "Clubs" },
        { "rank": "seven", "suit": "Diamonds" },
        { "rank": "King", "suit": "Hearts" },
        { "rank": "Jack", "suit": "Spades" },
        { "rank": "five", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 75,
      "cards": [
        { "rank": "Queen", "suit": "Clubs" },
        { "rank": "three", "suit": "Spades" },
        { "rank": "two", "suit": "Hearts" },
        { "rank": "eight", "suit": "Hearts" },
        { "rank": "Queen", "suit": "Hearts" }
      ]
    },
    {
      "hand_id": 76,
      "cards": [
        { "rank": "Jack", "suit": "Hearts" },
        { "rank": "seven", "suit": "Diamonds" },
        { "rank": "Jack", "suit": "Spades" },
        { "rank": "six", "suit": "Spades" },
        { "rank": "Ace", "suit": "Spades" }
      ]
    },
    {
      "hand_id": 77,
      "cards": [
        { "rank": "seven", "suit": "Diamonds" },
        { "rank": "four", "suit": "Clubs" },
        { "rank": "Ace", "suit": "Clubs" },
        { "rank": "Ace", "suit": "Diamonds" },
        { "rank": "Jack", "suit": "Clubs" }
      ]
    },
    {
      "hand_id": 78,
      "cards": [
        { "rank": "ten", "suit": "Clubs" },
        { "rank": "three", "suit": "Diamonds" },
        { "rank": "Ace", "suit": "Spades" },
        { "rank": "Ace", "suit": "Diamonds" },
        { "rank": "Queen", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 79,
      "cards": [
        { "rank": "two", "suit": "Clubs" },
        { "rank": "Jack", "suit": "Clubs" },
        { "rank": "six", "suit": "Diamonds" },
        { "rank": "eight", "suit": "Spades" },
        { "rank": "Queen", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 80,
      "cards": [
        { "rank": "Jack", "suit": "Spades" },
        { "rank": "eight", "suit": "Diamonds" },
        { "rank": "nine", "suit": "Diamonds" },
        { "rank": "ten", "suit": "Hearts" },
        { "rank": "seven", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 81,
      "cards": [
        { "rank": "King", "suit": "Hearts" },
        { "rank": "Ace", "suit": "Clubs" },
        { "rank": "three", "suit": "Diamonds" },
        { "rank": "King", "suit": "Clubs" },
        { "rank": "Ace", "suit": "Diamonds" }
      ]
    },
    {
      "hand_id": 82,
      "cards": [
        { "rank": "King", "suit": "Diamonds" },
        { "rank": "King", "suit": "Hearts" },
        { "rank": "seven", "suit": "Spades" },
        { "rank": "Queen", "suit": "Hearts" },
        { "rank": "King", "suit": "Clubs" }      
      ]
    }
  ]
}.poker_hands

const hands_impossible = [
    {
        "hand_id": "Impossible 1",
        "cards": [
            { "rank": "ten", "suit": "Spades"},
            { "rank": "ten", "suit": "Spades"},
            { "rank": "ten", "suit": "Spades"},
            { "rank": "ten", "suit": "Spades"},
            { "rank": "ten", "suit": "Spades"}
        ]
    },
    {
        "hand_id": "Impossible 2",
        "cards": [
            { "rank": "ten", "suit": "Spades"},
            { "rank": "ten", "suit": "Spades"},
            { "rank": "ten", "suit": "Spades"},
            { "rank": "ten", "suit": "Spades"},
            { "rank": "Ace", "suit": "Spades"}
        ]
    },
    {
        "hand_id": "Impossible 3",
        "cards": [
            { "rank": "Ace", "suit": "Spades"},
            { "rank": "ten", "suit": "Spades"},
            { "rank": "ten", "suit": "Spades"},
            { "rank": "Ace", "suit": "Spades"},
            { "rank": "ten", "suit": "Spades"}
        ]
    },
    {
        "hand_id": "Impossible 4",
        "cards": [
            { "rank": "ten", "suit": "Spades"},
            { "rank": "ten", "suit": "Spades"},
            { "rank": "ten", "suit": "Spades"},
            { "rank": "ten", "suit": "Spades"},
            { "rank": "ten", "suit": "Diamonds"}
        ]
    },
    {
        "hand_id": "Impossible 5",
        "cards": [
            { "rank": "King", "suit": "Spades"},
            { "rank": "Queen", "suit": "Spades"},
            { "rank": "Queen", "suit": "Spades"},
            { "rank": "Jack", "suit": "Spades"},
            { "rank": "Ace", "suit": "Spades"}
        ]
    }
]

// Hard-coding these as they were written will work for now. In another setting, use all lower-case keys for easier matching.
const rank_nums = {
    "two":      2,
    "three":    3,
    "four":     4,
    "five":     5,
    "six":      6,
    "seven":    7,
    "eight":    8,
    "nine":     9,
    "ten":      10,
    "Jack":     11,
    "Queen":    12,
    "King":     13,
    "Ace":      14
}

const rank_points = {
    "High Card":        1,
    "Pair":             2,
    "Two Pair":         4,
    "Three of a Kind":  8,
    "Straight":         16,
    "Flush":            32,
    "Full House":       64,
    "Four of a Kind":   128,
    "Straight Flush":   256,
    "Royal Flush":      512
}

const rank_points_impossible = {
    "Five of a Kind":   1024,
    "Flush House":      2048,
    "Flush Five":       4096
}

function get_freqs(hand) {
    // Translates rank strings into ints, then returns a frequency map object for the ranks in a given hand.
    // Example output: {5:2, 12:3} for a Jack-5 Full House
    let freq_map = {}
    for(let c = 0; c < hand.length; c++) {
        let rank_num = rank_nums[hand[c].rank]
        if(Object.hasOwn(freq_map, rank_num)) {
            freq_map[rank_num] += 1
        }
        else {
            freq_map[rank_num] = 1
        }
    }
    return freq_map
}

function is_flush(hand) {
    const suit = hand[0].suit
    return (hand[1].suit == suit) && (hand[2].suit == suit) && (hand[3].suit == suit) && (hand[4].suit == suit)
}

/*
function debug_print_obj_set(seth) {
    for(let ind = 0; ind < seth.length; ind++) {
        console.log(`Index ${ind} has ${Object.values(seth)}`)
    }
    return
}
*/

// NOTE: Hands can tie in Texas Hold 'Em, apparently.
//       If two hands with straights are equal, they tie and the pot is split. It doesn't come down to suit.
//       Every other hand has the kickers to break ties.
function is_straight(hand) {
    const freq_map = get_freqs(hand)
    let ranks = []
    // This could very well be done with a lambda/arrow function, but let's be unnecessary for the sake of practice. :)
    for(let c = 0; c < hand.length; c++) {
        // It would be good to include a failsafe for misspelled ranks, but maybe save that for another time.
        ranks.push(rank_nums[hand[c].rank])
    }
    let sorted_ranks = ranks
    // NOTE: Remember that the "sort()" method doesn't actually return anything,
    //       so don't use it to initialize a variable. It'll just set that var to nothing.
    // NOTE: The "sort()" method also treats every value as a string by default, leading to unintended faults
    //       if you're sorting numbers. Use a comparator function to work around this,
    //       like "arr.sort(function comp(a, b) {return a - b})".
    sorted_ranks.sort((a, b) => {return a - b})
    let min_rank = sorted_ranks[0]
    let bound = ranks.length - 1
    // If "wheel"/"Ace-low" straights aren't allowed, keep this part commented.
    if(min_rank == 2 && sorted_ranks.includes(14)) {
        bound--
    }
    for(let r = 0; r < bound; r++) {
        if(sorted_ranks[r+1] - sorted_ranks[r] != 1) {
            return false
        }
    }
    return true
}

function get_max_freq(freq_map) {
    // Given a frequency map (or other Object whose properties all hold ints), return the key:value pair with the greatest frequency.
    let max_val = 0
    let max_key = -1
    for(let key in freq_map) {
        // The comparison function here will work incorrectly if using strings representing numbers, like the original card ranks.
        // Be sure to convert them to ints or so first if the comparison is wanted...
        // or add a parameter for a comparison function for use here.
        if(freq_map[key] >= max_val) {
            max_key = key
            max_val = freq_map[key]
        }
    }
    return [max_key, max_val]
}

function score_hand(hand) {
    // This is just precautionary; this won't fire with the initial data set.
    // However, if something like Omaha Hold 'Em is used, and more than 5 cards are present, this would have to be changed.
    const hand_length = hand.length
    if(hand_length != 5) {
        console.log("Hand will not score - Must play 5 cards exactly.")
        return -1
    }

    const freq_map = get_freqs(hand)
    const [max_oak_key, max_oak_val] = get_max_freq(freq_map)
    // console.log(`Max OAK Key = ${max_oak_key}`)
    // console.log(`Max OAK Value = ${max_oak_val}`)

    if(max_oak_val > 1) {
        if(max_oak_val == 4) {
            console.log("Four of a Kind")
            return rank_points["Four of a Kind"]
        }
        else if(max_oak_val == 3) {
            // There must either be a frequency of 2 or 2 frequencies of 1 if this condition is reached.
            if(Object.values(freq_map).includes(2)) {
                console.log("Full House")
                return rank_points["Full House"]
            }
            else {
                console.log("Three of a Kind")
                return rank_points["Three of a Kind"]
            }
        }
        else {
            // At this point, the hand must be either two pairs and a dead card, or one pair and three dead cards.
            // In other words, the frequency map is either 3 for two pair or 4 otherwise.
            if(Object.values(freq_map).length == 3) {
                console.log("Two Pair")
                return rank_points["Two Pair"]
            }
            else {
                console.log("Pair")
                return rank_points["Pair"]
            }
        }
    }
    else {
        if(is_flush(hand)) {
            if(is_straight(hand)) {
                // Make sure this isn't an A-5 straight
                if(max_oak_key == 14 && !Object.keys(freq_map).includes("2")) {
                    console.log("Royal Flush")
                    return rank_points["Royal Flush"]
                }
                else {
                    console.log("Straight Flush")
                    return rank_points["Straight Flush"]
                }
            }
            else {
                console.log("Flush")
                return rank_points["Flush"]
            }
        }
        else if(is_straight(hand)) {
            console.log("Straight")
            return rank_points["Straight"]
        }
        else {
            console.log("High Card")
            return rank_points["High Card"]
        }
    }
    // This should never fire.
    console.error("Unknown hand; are all your cards correct?")
    return -1
}

// Identical to score_hand except for the inclusion of checks for the three impossible hands.
function score_hand_impossible(hand) {
    // This is just precautionary; this won't fire with the initial data set.
    // However, if something like Omaha Hold 'Em is used, and more than 5 cards are present, this would have to be changed.
    const hand_length = hand.length
    if(hand_length != 5) {
        console.log("Hand will not score - Must play 5 cards exactly.")
        return -1
    }

    const freq_map = get_freqs(hand)
    const [max_oak_key, max_oak_val] = get_max_freq(freq_map)
    // console.log(`Max OAK Key = ${max_oak_key}`)
    // console.log(`Max OAK Value = ${max_oak_val}`)

    if(max_oak_val > 1) {
        if(max_oak_val == 5) {
            if(is_flush(hand)) {
                console.log("Flush Five")
                return rank_points_impossible["Flush Five"]
            }
            else {
                console.log("Five of a Kind")
                return rank_points_impossible["Five of a Kind"]
            }
        }
        else if(max_oak_val == 4) {
            console.log("Four of a Kind")
            return rank_points["Four of a Kind"]
        }
        else if(max_oak_val == 3) {
            // There must either be a frequency of 2 or 2 frequencies of 1 if this condition is reached.
            // NOTE: "val in obj" checks if an object "obj" has a property "val".
            //       "Object.values(obj).includes(val)" checks if obj has a property with value "val".
            if(Object.values(freq_map).includes(2)) {
                if(is_flush(hand)) {
                    console.log("Flush House")
                    return rank_points_impossible["Flush House"]
                }
                else {
                    console.log("Full House")
                    return rank_points["Full House"]
                }
            }
            else {
                console.log("Three of a Kind")
                return rank_points["Three of a Kind"]
            }
        }
        else {
            // At this point, the hand must be either two pairs and a dead card, or one pair and three dead cards.
            // In other words, the frequency map is either 3 for two pair or 4 otherwise.
            if(Object.values(freq_map).length == 3) {
                console.log("Two Pair")
                return rank_points["Two Pair"]
            }
            else {
                console.log("Pair")
                return rank_points["Pair"]
            }
        }
    }
    else {
        if(is_flush(hand)) {
            if(is_straight(hand)) {
                // Make sure this isn't an A-5 straight
                // NOTE: Remember that object property keys are strings.
                if(max_oak_key == 14 && !Object.keys(freq_map).includes("2")) {
                    console.log("Royal Flush")
                    return rank_points["Royal Flush"]
                }
                else {
                    console.log("Straight Flush")
                    return rank_points["Straight Flush"]
                }
            }
            else {
                console.log("Flush")
                return rank_points["Flush"]
            }
        }
        else if(is_straight(hand)) {
            console.log("Straight")
            return rank_points["Straight"]
        }
        else {
            console.log("High Card")
            return rank_points["High Card"]
        }
    }
    // This should never fire.
    console.log("Unknown hand; are all your cards correct?")
    return -1
}

function score_all_hands(poker_hands=hands) {
    let total_score = 0
    for(let h = 0; h < poker_hands.length; h++) {
        let this_hand = poker_hands[h].cards
        let this_score = score_hand_impossible(this_hand)
        console.log(`Scoring hand ${poker_hands[h].hand_id}:\t${this_score}\n`)
        total_score += this_score
    }
    return total_score
}

console.log(`The total score for all ${hands.length} hands is ${score_all_hands(hands)}`)
console.log(`The total score for all ${hands_impossible.length} hands is ${score_all_hands(hands_impossible)}`)
console.log("All done <3")
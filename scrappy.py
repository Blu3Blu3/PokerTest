# Raaa I love gambling raaa

import random

# Globals
HANDS = ("High Card", "Pair", "Two Pairs", "Three of a Kind", "Straight",
         "Flush", "Full House", "Four of a Kind", "Straight Flush", "Royal Flush")
SUITS = ("Clubs", "Diamonds", "Hearts", "Spades")
VALUES = ("Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King")

# Classes
class Card:
    def __init__(self, suit = 0, value = 0):
        self.suit = suit
        self.value = value

    # Getters and setters
    def getSuit(self):
        return self.suit
    
    def getValue(self):
        return self.value
    
    def setSuit(self, suit):
        self.suit = suit

    def setValue(self, value):
        self.value = value

    # Returns a string saying what card this is.
    def sayCard(self):
        return f"{VALUES[self.value]} of {SUITS[self.suit]}"
    
    # Returns a list of this card's suit and value.
    #   sortBySuit (bool): Denotes whether or not to return a list with the suit first.
    def getCard(self, sortBySuit=True):
        return [self.suit, self.value] if sortBySuit else [self.value, self.suit]

# Functions
# Let's test findMaxOfAKind first...
# Edge cases: Empty parameters, 6+ parameters
# Returns an int 1-5.
# This doesn't need to have a spread operator because it works with
#   a list of variable length anyway.
def findMaxOfAKind(cards) -> int:
    # Sort cards first by value and suit.
    sortedCards = sorted(cards, key = lambda card: card.getCard(sortBySuit=False))
    
    # DEBUG: Say each card first.
    print("Working on:")
    for s in sortedCards:
        print(s.sayCard())
    print("\n")
    
    # Length check first
    if len(cards) < 1:
        print("Invalid hand length: too short")
        return -1
        
    # Then track the current highest OAK, its value, and the current # of cards matching something.
    # For each card...
    maxOfAKind = 1
    # It's ok to have this as a default value since it's not checked by anything.
    maxValue = sortedCards[0].getValue()
    currentOfAKind = 0
    currentValue = sortedCards[0].getValue()
    
    # From the second card onwards (if there are any)...
    for card in sortedCards:
        # If the current card's value matches the currently checked value:
        #   Increment currentOfAKind by 1 and continue.
        if card.getValue() == currentValue:
            currentOfAKind += 1
            currentValue = card.getValue()
            if currentOfAKind > maxOfAKind:
                maxOfAKind = currentOfAKind
                maxValue = card.getValue()
        # Else...
        #   If currentOfAKind > maxOfAKind, set maxOfAKind to currentOfAKind. Then, reset currentOfAKind.
        #   Else, continue.
        else:
            # If there's a value switch on equal OAKs (ex., pair Aces to pair Jacks), maxVal = the higher-scoring one.
            if currentOfAKind == maxOfAKind:
                # Add a check for Aces (value = 0) since they beat everything out.
                if (currentValue > maxValue and maxValue != 0):
                    maxValue = currentValue
            if currentOfAKind > maxOfAKind:
                # Also, if maxValue != currentValue, set maxValue to currentValue.
                maxOfAKind = currentOfAKind
                maxValue = card.getValue()
            currentOfAKind = 1
            currentValue = card.getValue()

    # I just realized this is finding the mode. There's a method for that in the "statistics"
    # module, but nah.... Not now.....
            
    return [maxOfAKind, maxValue]
            
# Test here
test1 = (Card(0, 0), Card(0, 1), Card(0, 2), Card(0, 3), Card(0, 4)) # High card
test2 = (Card(0, 0), Card(1, 0), Card(2, 0), Card(0, 3), Card(1, 3)) # 3OAK
test3 = (Card(0, 0), Card(0, 0), Card(0, 0), Card(0, 0), Card(0, 0)) # 5OAK

testEmpty = ()
testOverflow1 = (Card(0, 0), Card(0, 1), Card(0, 2), Card(0, 3), Card(0, 4), Card(0, 5), Card(0, 6)) # High card
testOverflow2 = (Card(0, 0), Card(0, 1), Card(0, 2), Card(0, 3), Card(0, 4), Card(0, 5), Card(0, 5)) # Pair

testRandom1 = []
for r in range(5):
    testRandom1.append(Card(random.randint(0, 3), random.randint(0, 12)))
testRandom2 = []
for r in range(50):
    testRandom2.append(Card(random.randint(0, 3), random.randint(0, 12)))

print(f"Test 1: {findMaxOfAKind(test1)}",
      f"Test 2: {findMaxOfAKind(test2)}",
      f"Test 3: {findMaxOfAKind(test3)}",
      f"Test Empty: {findMaxOfAKind(testEmpty)}",
      f"Test Overflow 1: {findMaxOfAKind(testOverflow1)}",
      f"Test Overflow 2: {findMaxOfAKind(testOverflow2)}",
      f"Test Random 1: {findMaxOfAKind(testRandom1)}",
      f"Test Random 2: {findMaxOfAKind(testRandom2)}",
      sep = "\n")
      
      
      

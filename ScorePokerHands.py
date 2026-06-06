'''
Aja Viselle
Started: 6/2/2026
Finished: -----
Validated: -----
Last updated: 6/3/2026

Testing out how to score poker hands before moving to program it in Java.

Here, there will be base classes for cards and decks, then methods for
basic operations (i.e., sorting, shuffling) and hand scoring (i.e.,
comparing hand types and card values).
'''

import random

# Globals
HANDS = ("High Card", "Pair", "Two Pairs", "Three of a Kind", "Straight", "Flush", "Full House", "Four of a Kind", "Straight Flush", "Royal Flush")
SUITS = ("Clubs", "Diamonds", "Hearts", "Spades")
VALUES = ("Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King")
MODIFIERS_GOOD = ("Wild", "Lucky", "Repeat")
MODIFIERS_BAD = ("Burning", "Sticky", "Frail")

# The base for a playing card, featuring a suit and value.
#   suit (int): 
class Card:
    def __init__(self):
        self.suit = 0
        self.value = 0

    def __init__(self, suit, value):
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
    def getCard(self):
        return [self.suit, self.value]


# A prototype of the kind of card used in a game. Feels familiar, no?
class GameCard(Card):
    pass

# The base for a deck of cards, with 4 suits of 13 cards each by default.
class Deck():
    def __init__(self):
        self.cards = []
        for s in range(4):
            for v in range(13):
                currentCard = Card(s, v)
                self.cards.append(currentCard)
        self.name = "Standard Deck"

    # All this to not have a global variable in a weird spot. Hm.
    def __init__(self, cards = [Card(0, 0), Card(0, 1), Card(0, 2), Card(0, 3), Card(0, 4), Card(0, 5), Card(0, 6), Card(0, 7), Card(0, 8), Card(0, 9), Card(0, 10), Card(0, 11), Card(0, 12),
                                Card(1, 0), Card(1, 1), Card(1, 2), Card(1, 3), Card(1, 4), Card(1, 5), Card(1, 6), Card(1, 7), Card(1, 8), Card(1, 9), Card(1, 10), Card(1, 11), Card(1, 12),
                                Card(2, 0), Card(2, 1), Card(2, 2), Card(2, 3), Card(2, 4), Card(2, 5), Card(2, 6), Card(2, 7), Card(2, 8), Card(2, 9), Card(2, 10), Card(2, 11), Card(2, 12),
                                Card(3, 0), Card(3, 1), Card(3, 2), Card(3, 3), Card(3, 4), Card(3, 5), Card(3, 6), Card(3, 7), Card(3, 8), Card(3, 9), Card(3, 10), Card(3, 11), Card(3, 12)],
                                name="Standard Deck"):
        self.cards = cards.copy()
        self.name = name

    # Getters and setters
    def getCards(self):
        return self.cards
    
    def getName(self):
        return self.name
    
    # Overwrites the current list of cards with a given list.
    def setCards(self, cards):
        self.cards = cards.copy()

    def setName(self, name):
        self.name = name

    def addCard(self, newCard: Card):
        self.cards.append(newCard)

    # Removes from the deck a card whose suit and value match those given.
    def removeCard(self, suit, value):
        pass

    # Returns a shuffled copy of the cards in the deck.
    def shuffleDeck(self):
        copy = self.cards.copy()
        shuffled = []
        remaining = len(self.cards)
        while remaining > 0:
            currentCard = random.randrange(0, remaining)
            shuffled.append(copy.pop(currentCard))
            remaining -= 1
        del copy
        return shuffled.copy()

# TODO: Now that you've researched Python's "sorted()" function a bit, look into Java's Collections and Comparator classes.
# TODO: The former has a sort function and the latter would take place of the lambda used below.

# Returns True if two Cards have the same value.
def isPair(c1, c2):
    return c1.getValue() == c2.getValue()

# Returns True if three Cards have the same value.
def is3OAK(c1, c2, c3):
    return c1.getValue() == c2.getValue() and c1.getValue() == c3.getValue()

# Returns True if four Cards have the same value.
def is4OAK(c1, c2, c3, c4):
    return c1.getValue() == c2.getValue() and c1.getValue() == c3.getValue() and c1.getValue() == c4.getValue()

# Returns True if five Cards have the same value.
def is5OAK(c1, c2, c3, c4):
    return c1.getValue() == c2.getValue() and c1.getValue() == c3.getValue() and c1.getValue() == c4.getValue() and c1.getValue() == c5.getValue()

# Given two cards, returns which of their values is higher.
def getHigherSuit(c1, c2):
    return c1.getValue() if c1.getValue() >= c2.getValue() else c2.getValue()

# Given two cards, returns which of their suits is higher.
def getHigherSuit(c1, c2):
    return c1.getSuit() if c1.getSuit() >= c2.getSuit() else c2.getSuit()


# Finds the best poker hand in a given hand and returns its index in HANDS along with the highest ranked card(s).
#   cardsPlayed (Card[]): A played hand that must be 1-5 cards.
# Returns:
#   hand (int): The index of the best found poker hand in HANDS.
#   suit (int): The index of the highest found suit in SUITS.
#   rank1 (int): The highest rank in the hand.
#   rank2 (int): The second highest rank in the hand, only applicable for two pair and full house.

def scoreHand(cardsPlayed: list[Card]):
    hand = -1
    suit = -1
    rank1 = -1
    rank2 = -1

    match len(hand):
        # Only high card
        case 1:
            hand = 1
            suit = cardsPlayed[0].getSuit()
            rank1 = cardsPlayed[0].getValue()
        # Pair or high card
        case 2:
            if isPair(cardsPlayed[0], cardsPlayed[1]):
                hand = 2
                suit = getHigherSuit(cardsPlayed[0], cardsPlayed[1])
                rank1 = getHigherValue(cardsPlayed[0], cardsPlayed[1])
            else:
                hand = 1
                suit = getHigherSuit(cardsPlayed[0], cardsPlayed[1])
                rank1 = getHigherValue(cardsPlayed[0], cardsPlayed[1])
        # 30AK, pair, or high card
        case 3:
            pass
        case _:
            print("Invalid # of cards played.")
    
    return [hand, suit, rank1, rank2]



if __name__ == "__main__":
    myDeck = Deck()
    for c in myDeck.cards:
        print(c.sayCard())

    print("\n\nI'm a break ooo\n\n")

    shuffy = myDeck.shuffleDeck()
    for s in shuffy:
        print(s.sayCard())

    print("\n\nI'm a break ooo\n\n")

    # Tuples can't sort objects from the get go.
    # Instead, try "sorted()" with a key using a function that returns primitives, or a list of primitives.
    # Lambdas are growing on me :)
    muffy = sorted(shuffy.copy(), key=lambda card: card.getCard())
    for m in muffy:
        print(m.sayCard())

    print("All done!\n")
package src;

import java.util.Scanner;
import java.util.Random;
import java.util.Map;
import java.util.TreeMap;
import java.util.Arrays;

public class PokerGame extends Game
{
    // VARIABLES //

    // The deck to be used.
    private Deck baseDeck;
    // A collection of Card arrays denoting the hierarchy of hands. Lower key values denote stronger hands.
    private TreeMap<Integer, String> hands = new TreeMap<Integer, String>();
    // Integer value for the maximum amount of players, usually 4. Cannot be <= 0.
    // TODO: Add support for multiple players (as CPUs first).
    private int maxPlayers = 4;
    


    // CONSTRUCTORS //
    public PokerGame()
    {
        baseDeck = new Deck();
        hands.put(1, "Straight Flush");
        hands.put(2, "Four of a Kind");
        hands.put(3, "Full House");
        hands.put(4, "Flush");
        hands.put(5, "Straight");
        hands.put(6, "Three of a Kind");
        hands.put(7, "Two Pair");
        hands.put(8, "Pair");
        hands.put(9, "High Card");
    }

    public PokerGame(Deck baseDeck)
    {
        this.baseDeck = baseDeck;
        hands.put(1, "Straight Flush");
        hands.put(2, "Four of a Kind");
        hands.put(3, "Full House");
        hands.put(4, "Flush");
        hands.put(5, "Straight");
        hands.put(6, "Three of a Kind");
        hands.put(7, "Two Pair");
        hands.put(8, "Pair");
        hands.put(9, "High Card");
    }

    public PokerGame(Deck baseDeck, TreeMap<Integer, String> hands)
    {
        this.baseDeck = baseDeck;
        this.hands = hands;
    }



    // GETTERS & SETTERS

    public Deck getDeck()
    {
        return baseDeck;
    }

    // I wanted to call this "catchHands" sooo badly...
    public TreeMap<Integer, String> getHands()
    {
        return hands;
    }

    public int getMaxPlayers()
    {
        return maxPlayers;
    }

    public void setDeck(Deck baseDeck)
    {
        this.baseDeck = baseDeck;
    }

    public void setHands(TreeMap<Integer, String> hands)
    {
        this.hands = hands;
    }

    public void setMaxPlayers(int maxPlayers)
    {
        this.maxPlayers = maxPlayers;
    }

    

    // METHODS //

    // Sorts a given hand by rank.
    public int[] sortHandByRank(int[] hand)
    {
        // Hey there <3
        // Found a way to do this involving taking the mod 13 of all these #s, 
        Arrays.sort(hand);
        return hand;
    }
    
    // Scores a hand (Card[]) of cards, and returns the corresponding key from the "hands" hierarchy.
    // Hands must have at least 5 cards; anything less will cause this to exit and return null.
    // Subclasses of PokerClass may override this to include new hands (I'm looking at you, flush house and flush five).
    public Map<Integer, Integer> scoreHand(int[] hand)
    {
        // Length check
        if(hand.length < 5)
        {
            System.out.println("This hand won't work, it's too small! (" + hand.length + " cards)");
            return null;
        }
        // If it passes, go through and score the hand. Pseudocode for now.
        /*
        if(hasPair(hand))
        {
            if(hasThreeOfAKind(hand))
            {
                if(hasFourOfAKind(hand))
                {
                    // Four of a Kind
                    return <2, rank>;
                }
                else
                {
                    Remove Three of a Kind from hand
                    if(hasPair(hand))
                    {
                        // Full House
                        return <3, rank>;
                    }
                    else
                    {
                        // Three of a Kind
                        return <6, rank>;
                    }
                }
            }
            else
            {
                Remove Pair from hand
                if(hasPair(hand))
                {
                    // Two Pair
                    return <7, rank>;
                }
                else
                {
                    // Pair
                    return <8, rank>;
                }
            }
        }
        else
        {
            if(hasFlush(hand))
            {
                if(hasStraight(hand))
                {
                    // Straight flush
                    return <1, rank>;
                }
                else
                {
                    // Flush
                    return <4, rank>;
                }
            }
            else
            {
                if(hasStraight(hand))
                {
                    // Straight
                    return <5, rank>;
                }
                else
                {
                    // High card
                    return <9, rank>;
                }
            }
        }
        
        */
        return 0;
    }

    // Starts up a round of poker. Running multiple rounds is done by the Main file.
    public void runGame()
    {
        System.out.println("wow! yahoo!");
    }

}

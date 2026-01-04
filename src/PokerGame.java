package src;

import java.util.Scanner;
import java.util.Random;
import java.util.Map;
import java.util.TreeMap;
import java.util.Arrays;
import java.util.Collections;
import java.util.ArrayList;

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
        Arrays.sort(hand);
        return hand;
    }
    
    // Sorts a given hand by suit.
    // Note that this will probably fail if not every suit has the same set of card values, e.g., if one runs A-K and another runs A-10.
    // However, that's such an unlikely and unwieldy scenario that I'm not going to implement anything for it now.
    public int[] sortHandBySuit(int[] hand)
    {
        int[] ret = new int[hand.length];
        int currentInd = 0;
        int numSuits = baseDeck.getNumSuits();
        // Create buckets for each suit, then sort each bucket before combining their elements back into a sorted hand.
        ArrayList<ArrayList<Integer>> suitBuckets = new ArrayList<ArrayList<Integer>>();
        for(int s = 0; s < numSuits; s++)
        {
            suitBuckets.add(new ArrayList<Integer>());
        }
        for(int c = 0; c < hand.length; c++)
        {
            int ind = hand[c]%numSuits;
            suitBuckets.get(ind).add(hand[c]);
        }
        for(ArrayList<Integer> bucket : suitBuckets)
        {
            Collections.sort(bucket);
            for(int card : bucket)
            {
                ret[currentInd] = card;
                currentInd++;
            }
        }

        return ret;
    }

    public int[] getSortedHandValues(int[] hand)
    {
        int[] sortedHandValues = sortHandByRank(hand);
        for(int key = 0 ; key < sortedHandValues.length; key++)
        {
            sortedHandValues[key] = sortedHandValues[key]/baseDeck.getNumSuits();
        }
        return sortedHandValues;
    }

    // Searches for the first pair in a hand, returns its value if found, -1 if not.
    // Collections has a function to get the frequencies of each element in a List, called "frequency(list, target)". Yay!
    // TODO: Make a version that actually looks at each Card and checks its values, then finds pairs. And so forth for the other hands... Hm.
    public int hasXOfAKind(int[] hand, int cardsNeeded)
    {
        if(hand.length <= (cardsNeeded-1))
        {
            System.out.println("Hand too small.");
            return -1;
        }

        // Get the values for each card/key in the hand.
        int[] ranges = getSortedHandValues(hand);
        
        // Thank you https://stackoverflow.com/questions/880581/how-can-i-convert-int-to-integer-in-java
        ArrayList<Integer> handValues = new ArrayList<Integer>(Arrays.asList(Arrays.stream(ranges).boxed().toArray(Integer[]::new)));
        for(int key : ranges)
        {
            if(Collections.frequency(handValues, ranges[key]) >= cardsNeeded)
            {
                return key;
            }
        }
        return -1;


        /*
        // Keeping this around for reference, in case the Collections framework can't be used.
        int[] sortedHand = sortHandByRank(hand);
        int pairVal = hand[0];
        int range = hand[0]/baseDeck.getNumSuits();
        for(int k = 1; k < hand.length; k++)
        {
            // If the current key is in the same value range as the key being checked against (e.g., keys 1 and 3 for Ace of Spades and Ace of Diamonds), return the value of the checked key.
            if(range == hand[k]/baseDeck.getNumSuits())
            {
                return pairVal;
            }
            // Otherwise, check the next key against the current key and its range.
            else
            {
                pairVal = hand[k];
                range = hand[k]/baseDeck.getNumSuits();
            }
        }
        return -1;
        */
    }
    
    // Scores a hand (int[]) of cards, and returns the corresponding key from the "hands" hierarchy.
    // Hands must have at least 1 card; anything less will cause this to exit and return -1.
    // Subclasses of PokerClass may override this to include new hands (I'm looking at you, flush house and flush five).
    public int scoreHand(int[] hand)
    {
        // Length check
        if(hand.length < 1)
        {
            System.out.println("This hand won't work, it's too small! (" + hand.length + " cards)");
            return -1;
        }

        // Has a pair
        if(hasXOfAKind(hand, 2) != -1)
        {
            // Has a three of a kind
            if(hasXOfAKind(hand, 3) != -1)
            {
                if(hasXOfAKind(hand, 4) != -1)
                {
                    return 2;
                }
                else
                {
                    int[] sortedHandValues = getSortedHandValues(hand);
                    int cutoffInd = Arrays.binarySearch(sortedHandValues, hasXOfAKind(sortedHandValues, 3));
                    // Has a full house
                    if(hasXOfAKind(Arrays.copyOfRange(sortedHandValues, cutoffInd, sortedHandValues.length), 2) != -1)
                    {
                        return 3;
                    }
                    else
                    {
                        return 6;
                    }
                }
            }
            // Check for two pairs
            else
            {
                int[] sortedHandValues = getSortedHandValues(hand);
                int cutoffInd = Arrays.binarySearch(sortedHandValues, hasXOfAKind(sortedHandValues, 2));
                // Has two pairs
                if(hasXOfAKind(Arrays.copyOfRange(sortedHandValues, cutoffInd, sortedHandValues.length), 2) != -1)
                {
                    return 7;
                }
                else
                {
                    return 8;
                }
            }
        }
        else
        {

        }

        /*
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

package src;

import java.util.Random;
//import java.util.Map;
import java.util.HashMap;
import java.util.TreeMap;

// A class for making a deck of cards whose values are stored as key-value pairs.
// Ex. {
public class Deck
{
	// VARIABLES //
	
	// Not meant to be immutable, thank you.
	// Hey, note to self: Remember that Maps are only meant to hold key-value pairs. If you want more functionality, you'll have to use objects for the values, or use something else.  
	// The whole deck of Cards.
	private TreeMap<Integer, Card> deck = new TreeMap<Integer, Card>();
	private String[] suits = {"Spades", "Hearts", "Diamonds", "Clubs"};
	private int maxValue = 13;
	// The name of the deck. More useful once there are multiple decks to select from.
	private String name;
	
	
	
	// GETTERS & SETTERS //
	
	public TreeMap<Integer, Card> getDeck()
	{
		return deck;
	}
	
	// For if you have a deck (TreeMap) ready to go.
	// TODO: Make this compatible with the other Map types, or at least just Map. It may be useful to have non-sorted decks...
	public void setDeck(TreeMap<Integer, Card> deck)
	{
		this.deck = deck;
	}
	
	public String getName()
	{
		return name;
	}
	
	public void setName(String name)
	{
		this.name = name;
	}
	
	// Get a card from the deck given its key.
	public Card getCard(int key)
	{
		return deck.get(key);
	}
	
	// Set a key to be paired with a given card (object).
	public void setCard(int key, Card card)
	{
		deck.put(key,  card);
	}
	
	// Set a key to be paired with a given card (member variables).
	public void setCard(int key, int value, int suit, String suitDesc, String cardDesc)
	{
		deck.put(key, new Card(value, suit, suitDesc, cardDesc));
	}

	// Get the number of suits in the deck.
	public int getNumSuits()
	{
		return suits.length;
	}

	// Get the maximum value of a card in the deck.
	// Changing this doesn't really provide much meaning unless the deck is also changed to reflect it, and that is effectively the same as making a new deck.
	// Suffice to say, there's no need for this to have a setter.
	public int getMaxValue()
	{
		return maxValue;
	}




	// CONSTRUCTORS //
	
	public Deck()
	{
		// Initialize the deck as a standard set of 52 playing cards.
		// All Aces first, then 2s, etc., with suits in order of Spades, Hearts, Diamonds, Clubs.
		for(int n = 1; n <= maxValue; n++)
		{
			for(int s = 0; s <= suits.length; s++)
			{
				switch(n)
				{
					case(1):
						deck.put(deck.size(), new Card(n, s, suits[s], "Ace of " + suits[s]));
						break;
					case(11):
						deck.put(deck.size(), new Card(n, s, suits[s], "Jack of " + suits[s]));
						break;
					case(12):
						deck.put(deck.size(), new Card(n, s, suits[s], "Queen of " + suits[s]));
						break;
					case(13):
						deck.put(deck.size(), new Card(n, s, suits[s], "King of " + suits[s]));
						break;
					default:
						deck.put(deck.size(), new Card(n, s, suits[s], n + " of " + suits[s]));
						break;
				}
			}
			System.out.println("Standard deck initialized.");
		}
	}
	
	
	
	// METHODS //
	
	// Adds a card to the deck given a value (int), suit (int), suit description (String), and card description (String).
	// See the Card class for more about those values.
	public void addOneCustomToDeck(int value, int suit, String suitDesc, String cardDesc)
	{
		deck.put(deck.size(), new Card(value, suit, suitDesc, cardDesc));
	}
	
	// Adds multiple cards to the deck given an array of Cards.
	public void addCustomsToDeck(Card[] cards)
	{
		for(Card card : cards)
		{
			deck.put(deck.size(), card);
		}
	}
	
	// Returns a shuffled copy of the deck.
	public HashMap<Integer, Card> shuffleDeck()
	{
		HashMap<Integer, Card> shuffledDeck = new HashMap<Integer, Card>();
		TreeMap<Integer, Card> rundownDeck = deck;
		Random randSeed = new Random();
		int currentCard;
		while(rundownDeck.size() != 0)
		{
			currentCard = randSeed.nextInt(rundownDeck.size());
			shuffledDeck.put(shuffledDeck.size() + 1, rundownDeck.get(currentCard));
			rundownDeck.remove(currentCard);
		}
		// Is it necessary to delete rundownDeck?
		return shuffledDeck;
	}
}

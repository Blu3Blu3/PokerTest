package PokerGame;

// A class for making playing cards with values, suits, and effects (ex., for jokers).
public class Card
{
	// VARIABLES //
	
	// Value. Usually positive between 1-13, for A-K.
	private int value;
	// Value between 1-4, going in order of Spades -> Hearts -> Diamonds -> Clubs. Jokers or custom cards may use other numbers for suits, but preferably they're >= 0.
	private int suit;
	// Describes the suit of the card (ex. "Diamond").
	private String suitDesc;
	// Describes the card itself (ex. "Ace of Spades", "Joker").
	private String cardDesc;
	// Denotes an effect the card has; not really useful for poker, but if this class gets reused in other games, it'd be more useful.
	// Maybe this can be swapped out for a String, boolean, or object, depending on what's needed...
	private int effect = 0;
	
	
	
	// GETTERS & SETTERS //
	
	public int getValue()
	{
		return value;
	}
	
	public int getSuit()
	{
		return suit;
	}
	
	public String getSuitDesc()
	{
		return suitDesc;
	}
	
	public String getCardDesc()
	{
		return cardDesc;
	}
	
	public int getEffect()
	{
		return effect;
	}
	
	public void setValue(int value)
	{
		this.value = value;
	}
	
	public void setSuit(int suit)
	{
		this.suit = suit;
	}
	
	public void setSuitDesc(String suitDesc)
	{
		this.suitDesc = suitDesc;
	}
	
	public void setCardDesc(String cardDesc)
	{
		this.cardDesc = cardDesc;
	}
	
	public void setEffect(int effect)
	{
		this.effect = effect;
	}
	
	
	
	// CONSTRUCTORS //
	
	public Card()
	{
		value = 1;
		suit = 1;
		suitDesc = "Spade";
		cardDesc = "Ace of Spades";
	}
	
	public Card(int value, int suit, String suitDesc, String cardDesc)
	{
		this.value = value;
		this.suit = suit;
		this.suitDesc = suitDesc;
		this.cardDesc = cardDesc;
	}
	
	public Card(int value, int suit, String suitDesc, String cardDesc, int effect)
	{
		this.value = value;
		this.suit = suit;
		this.suitDesc = suitDesc;
		this.cardDesc = cardDesc;
		this.effect = effect;
	}
	
	
	
	// METHODS //
	
	// Says what the card is.
	public String announceCard()
	{
		String pluralSuit = suitDesc.substring(suitDesc.length()-1).equals("s") ? (suitDesc + "es") : suitDesc;
		String wordValue;
		if (value == 1)
		{
			wordValue = "Ace";
		}
		else if (value == 11)
		{
			wordValue = "Jack";
		}
		else if (value == 12)
		{
			wordValue = "Queen";
		}
		else if (value == 13)
		{
			wordValue = "King";
		}
		else
		{
			wordValue = "" + value;
		}
		return ("This is a " + wordValue + " of " + pluralSuit + ", a.k.a. \"" + cardDesc + "\".");
	}
}




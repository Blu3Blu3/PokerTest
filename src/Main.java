package src;

//import java.util.Map;
//import java.util.HashMap;
import java.util.TreeMap;
import java.util.Scanner;

public class Main
{
	// GAME VARIABLES //

	// Available games the player can pick from in the main menu. Adjust as necessary.
	public static String[] games = {"Texas Hold 'Em"};

	// GAME LOGIC //

	// PARSER LOGIC //
	public static void startParser()
	{
		// Greet
		System.out.println("Welcome! What would you like to play today?");
		System.out.println("Enter a number:\n");
		for(int g = 0; g < games.length; g++)
		{
			System.out.println(g + ": " + games[g]);
		}

		// Get initial input
		Scanner playerInput = new Scanner(System.in);
		try
		{
		}
		catch (Exception e)
		{
			// TODO: handle exception
		}
	}

	public static void main(String[] args)
	{
		// Let's start by making a text-only version.
		// The player is greeted first, and if they want to play, run a continuous game loop until they don't.
		// TODO: Allow for multiple rounds and tracked scores. Would be a good way to work with file saving too.
		System.out.println("Yehey!");
	}
}

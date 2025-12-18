package src;

public abstract class Game
{
    // VARIABLES //
    
    // The name of the game, hehe.
    private String name;
    // The description of the game.
    private String desc;



    // GETTERS & SETTERS //

    public String getGameName()
    {
        return name;
    }

    public String getGameDesc()
    {
        return desc;
    }

    public void setGameName(String name)
    {
        this.name = name;
    }

    public void setGameDesc(String desc)
    {
        this.desc = desc;
    }



    // CONSTRUCTORS //

    public Game()
    {
        name = "";
        desc = "";
    }

    public Game(String name)
    {
        this.name = name;
        desc = "";
    }

    public Game(String name, String desc)
    {
        this.name = name;
        this.desc = desc;
    }
    
    
    // METHODS //

    // Runs the game. Must be initialized by a subclass.
    public abstract void runGame();
}

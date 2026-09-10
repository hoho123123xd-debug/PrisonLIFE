using UnityEngine;

public class HelloWorld : MonoBehaviour
{
    private const string Message = "Hello, Prison Life!";

    private GUIStyle _style;

    private void OnGUI()
    {
        _style ??= new GUIStyle(GUI.skin.label)
        {
            fontSize = 32,
            alignment = TextAnchor.MiddleCenter,
            normal = { textColor = Color.white },
        };

        GUI.Label(new Rect(0, 0, Screen.width, Screen.height), Message, _style);
    }
}

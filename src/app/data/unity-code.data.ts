export interface UnityScriptFile {
  filename: string;
  className: string;
  description: string;
  code: string;
  highlights: string[];
}

export const UNITY_ARCHITECTURE_SCRIPTS: UnityScriptFile[] = [
  {
    filename: 'DataPath.cs',
    className: 'DataPath',
    description: 'Controlador de ruta y desplazamiento de paquetes de datos en la cuadrícula de red de Unity.',
    highlights: [
      'Detecta si el paquete es legítimo o amenaza de phishing.',
      'Controla la dirección vectorial (Up, Down, Left, Right).',
      'Calcula colisiones con nodos de red y desvíos a cuarentena.'
    ],
    code: `using UnityEngine;
using System.Collections;

/// <summary>
/// Phishing Escape: Cyber Maze
/// Gestor de Rutas de Datos (DataPath.cs)
/// </summary>
public class DataPath : MonoBehaviour
{
    [Header("Configuración del Paquete")]
    public string packetId = "PKT-001";
    public bool isPhishing; // Define si es amenaza o paquete seguro
    public Vector2 direction = Vector2.right; // Dirección de desplazamiento (Up, Down, Left, Right)
    public float moveSpeed = 4.0f;
    public bool isBlocked;
    public bool isDelivered;

    [Header("Referencias Visuales")]
    public SpriteRenderer packetSprite;
    public TrailRenderer dataTrail;
    public Color safeColor = new Color(0f, 0.9f, 1f, 1f);     // Neón Cian #00e5ff
    public Color threatColor = new Color(1f, 0f, 0.33f, 1f);  // Neón Magenta #ff0055

    private Vector2Int currentGridPosition;

    void Start()
    {
        InitializeVisuals();
    }

    void InitializeVisuals()
    {
        if (packetSprite != null)
        {
            packetSprite.color = isPhishing ? threatColor : safeColor;
        }
        if (dataTrail != null)
        {
            dataTrail.startColor = isPhishing ? threatColor : safeColor;
            dataTrail.endColor = new Color(dataTrail.startColor.r, dataTrail.startColor.g, dataTrail.startColor.b, 0f);
        }
    }

    void OnMouseDown()
    {
        // Al hacer clic, el operador puede inspeccionar el paquete o forzar el avance
        if (!isDelivered && !isBlocked)
        {
            TryMovePath();
        }
    }

    public void TryMovePath()
    {
        // Lógica de detección en la cuadrícula (Grid) para desplazar el paquete hacia su destino
        StartCoroutine(StepAlongNetwork());
    }

    private IEnumerator StepAlongNetwork()
    {
        Vector3 targetPosition = transform.position + new Vector3(direction.x, direction.y, 0f);
        float elapsed = 0f;
        Vector3 initialPos = transform.position;

        while (elapsed < 0.25f)
        {
            transform.position = Vector3.Lerp(initialPos, targetPosition, elapsed / 0.25f);
            elapsed += Time.deltaTime;
            yield return null;
        }

        transform.position = targetPosition;
        CheckNodeDestination();
    }

    private void CheckNodeDestination()
    {
        Collider2D hit = Physics2D.OverlapCircle(transform.position, 0.2f);
        if (hit != null)
        {
            if (hit.CompareTag("SafeServer"))
            {
                isDelivered = true;
                SecurityManager.Instance.OnPacketDelivered(this);
            }
            else if (hit.CompareTag("QuarantineZone"))
            {
                isDelivered = true;
                SecurityManager.Instance.OnThreatQuarantined(this);
            }
            else if (hit.CompareTag("NetworkRouter"))
            {
                // Reruta automáticamente según la orientación del nodo
                NetworkRouter router = hit.GetComponent<NetworkRouter>();
                if (router != null)
                {
                    direction = router.GetNextDirection(direction);
                }
            }
        }
    }
}`
  },
  {
    filename: 'SecurityManager.cs',
    className: 'SecurityManager',
    description: 'Gestor central de seguridad, integridad del escudo, condiciones de victoria y cápsulas educativas.',
    highlights: [
      'Monitorea el total de datos seguros y amenazas restantes.',
      'Controla la integridad del escudo de firewall corporativo.',
      'Dispara la cápsula educativa contextual al completar o fallar el nivel.'
    ],
    code: `using UnityEngine;
using UnityEngine.Events;

/// <summary>
/// Phishing Escape: Cyber Maze
/// Gestor de Seguridad y Victoria (SecurityManager.cs)
/// </summary>
public class SecurityManager : MonoBehaviour
{
    public static SecurityManager Instance { get; private set; }

    [Header("Métricas de Nivel")]
    public int totalSafeData = 2;
    public int totalPhishingThreats = 1;
    public int safeDataDelivered = 0;
    public int threatsNeutralized = 0;

    [Header("Integridad del Sistema")]
    public int shieldIntegrity = 100; // 0 - 100%
    public int damagePerPhishingBreach = 25;

    [Header("Eventos de Juego")]
    public UnityEvent onLevelCompleted;
    public UnityEvent onSystemBreached;
    public UnityEvent onShieldDamaged;

    void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
    }

    public void OnPacketDelivered(DataPath packet)
    {
        if (packet.isPhishing)
        {
            // ¡Infección en el servidor limpio!
            shieldIntegrity = Mathf.Max(0, shieldIntegrity - damagePerPhishingBreach);
            Debug.LogWarning("¡ALERTA! Paquete de phishing ha infectado el Servidor Central. Escudo: " + shieldIntegrity + "%");
            onShieldDamaged?.Invoke();

            if (shieldIntegrity <= 0)
            {
                TriggerDefeat("El núcleo del servidor ha sido comprometido por malware.");
                return;
            }
        }
        else
        {
            safeDataDelivered++;
            Debug.Log("Paquete legítimo asegurado en el Servidor Central. (" + safeDataDelivered + "/" + totalSafeData + ")");
        }

        CheckWinCondition();
    }

    public void OnThreatQuarantined(DataPath threat)
    {
        if (threat.isPhishing)
        {
            threatsNeutralized++;
            Debug.Log("Amenaza desviada con éxito al contenedor de cuarentena.");
        }
        else
        {
            // Paquete limpio enviado a la papelera por error
            shieldIntegrity -= 10;
            Debug.LogWarning("Falso Positivo: Un paquete legítimo fue destruido.");
        }

        CheckWinCondition();
    }

    public void CheckWinCondition()
    {
        if (safeDataDelivered >= totalSafeData && threatsNeutralized >= totalPhishingThreats)
        {
            Debug.Log("¡Red limpia! Has escapado del Phishing con integridad intacta.");
            onLevelCompleted?.Invoke();
            // Activar transición al siguiente nivel o tarjeta educativa
            ShowKnowledgeCard();
        }
    }

    private void ShowKnowledgeCard()
    {
        // Invoca el popup de la Cápsula Educativa de Ciberseguridad
        EducationalUIManager.Instance?.DisplayCurrentLevelCard();
    }

    private void TriggerDefeat(string reason)
    {
        Debug.LogError("Misión Fallida: " + reason);
        onSystemBreached?.Invoke();
    }
}`
  },
  {
    filename: 'NetworkRouter.cs',
    className: 'NetworkRouter',
    description: 'Nodo conmutador direccionable (Switch/Router) que redirige el flujo de datos según rotación.',
    highlights: [
      'Gira en incrementos de 90 grados al hacer clic.',
      'Calcula la nueva dirección ortogonal del paquete entrante.',
      'Emite pulsos luminosos de feedback háptico/visual.'
    ],
    code: `using UnityEngine;

/// <summary>
/// Nodo interactivo de conmutación de red (NetworkRouter.cs)
/// </summary>
public class NetworkRouter : MonoBehaviour
{
    public enum RouterType { Straight, Corner, Cross, FirewallGate }
    public RouterType type = RouterType.Corner;
    public int currentRotationIndex = 0; // 0=0°, 1=90°, 2=180°, 3=270°

    void OnMouseDown()
    {
        RotateNode();
    }

    public void RotateNode()
    {
        currentRotationIndex = (currentRotationIndex + 1) % 4;
        transform.rotation = Quaternion.Euler(0, 0, -currentRotationIndex * 90f);
        AudioManager.Instance?.PlaySoundEffect("router_click");
    }

    public Vector2 GetNextDirection(Vector2 incomingDir)
    {
        // Algoritmo de redirección según el tipo de nodo y rotación actual
        // Ejemplo para codo (Corner):
        if (type == RouterType.Corner)
        {
            // Transforma la dirección cartesiana
            return new Vector2(-incomingDir.y, incomingDir.x);
        }
        return incomingDir;
    }
}`
  }
];

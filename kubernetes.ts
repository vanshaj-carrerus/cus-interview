import { TopicData } from "@/app/practice/data/types";

export const kubernetesMasteryData: TopicData = {
  slug: "kubernetes-mastery",
  title: "Kubernetes Mastery",
  intro: "Master container orchestration, from fundamental cluster architecture and workloads to advanced networking, storage, and security.",
  levels: [
    {
      level: 1,
      title: "Level 1: Kubernetes Fundamentals & Architecture",
      description: "Control plane components, worker nodes, and basic concepts.",
      passScore: 16,
      questions: [
        {
          id: "k8s-1-1",
          question: "What is Kubernetes?",
          options: [
            "A virtualization software for running Windows on Linux",
            "A CI/CD pipeline tool built by Microsoft",
            "An open-source container orchestration platform that automates deployment, scaling, and management of containerized applications",
            "A local development environment for writing Dockerfiles"
          ],
          answerIndex: 2,
          explanation: "Originally developed by Google, Kubernetes acts as the 'operating system' for your data center, managing thousands of containers across clusters of hosts."
        },
        {
          id: "k8s-1-2",
          question: "Which component of the Kubernetes Control Plane is responsible for storing all cluster data and state?",
          options: [
            "kube-scheduler",
            "etcd",
            "kubelet",
            "kube-apiserver"
          ],
          answerIndex: 1,
          explanation: "etcd is a consistent and highly-available key-value store. It is the ultimate source of truth for the cluster; if etcd dies, the cluster loses its state."
        },
        {
          id: "k8s-1-3",
          question: "What is the role of the `kube-apiserver`?",
          options: [
            "It executes containers on worker nodes",
            "It routes external internet traffic to the cluster",
            "It acts as the front end for the Kubernetes control plane, exposing the Kubernetes API to users, CLI tools, and internal components",
            "It manages persistent storage volumes"
          ],
          answerIndex: 2,
          explanation: "All communication inside the cluster goes through the apiserver. Components never talk directly to each other or to etcd; they only talk to the apiserver."
        },
        {
          id: "k8s-1-4",
          question: "Which node component makes sure that containers are running in a Pod as expected by the Control Plane?",
          options: [
            "kube-proxy",
            "CoreDNS",
            "kube-controller-manager",
            "kubelet"
          ],
          answerIndex: 3,
          explanation: "The kubelet is the primary 'node agent' that runs on each worker node. It registers the node with the apiserver and manages the lifecycle of the Pods assigned to it."
        },
        {
          id: "k8s-1-5",
          question: "What is the `kube-scheduler` responsible for?",
          options: [
            "Watching for newly created Pods with no assigned node, and selecting a node for them to run on",
            "Scheduling automated database backups",
            "Timing cron jobs inside containers",
            "Balancing network traffic across nodes"
          ],
          answerIndex: 0,
          explanation: "The scheduler evaluates resource requirements, hardware constraints, and affinity/anti-affinity specifications to place a Pod on the most optimal worker node."
        },
        {
          id: "k8s-1-6",
          question: "What does `kube-proxy` do on a worker node?",
          options: [
            "It builds Docker images",
            "It acts as a reverse proxy for the API server",
            "It maintains network rules on the node, allowing network communication to your Pods from network sessions inside or outside of the cluster",
            "It stops malicious containers from communicating"
          ],
          answerIndex: 2,
          explanation: "kube-proxy implements the Kubernetes Service concept, typically using operating system packet filtering layers like iptables or IPVS."
        },
        {
          id: "k8s-1-7",
          question: "What is `kubectl`?",
          options: [
            "A graphical dashboard for Kubernetes",
            "The standard command-line tool used to run commands against Kubernetes clusters",
            "A programming language for defining containers",
            "A container runtime alternative to Docker"
          ],
          answerIndex: 1,
          explanation: "`kubectl` authenticates with the kube-apiserver to deploy applications, inspect cluster resources, and view logs."
        },
        {
          id: "k8s-1-8",
          question: "What is a 'Namespace' in Kubernetes?",
          options: [
            "A way to divide cluster resources between multiple users or teams (providing a scope for names)",
            "A physical separation of worker nodes",
            "A DNS server configuration",
            "A container image registry"
          ],
          answerIndex: 0,
          explanation: "Namespaces allow you to have a 'dev' and 'prod' environment in the same physical cluster without naming collisions, acting as virtual clusters."
        },
        {
          id: "k8s-1-9",
          question: "Which of the following resources is strictly Cluster-scoped (cannot be created inside a specific Namespace)?",
          options: [
            "ConfigMap",
            "PersistentVolume (PV)",
            "Secret",
            "Deployment"
          ],
          answerIndex: 1,
          explanation: "While a PersistentVolumeClaim (PVC) is namespaced, the actual PersistentVolume (PV) represents physical hardware and is available cluster-wide."
        },
        {
          id: "k8s-1-10",
          question: "What does the `cloud-controller-manager` do?",
          options: [
            "It forces developers to use cloud services",
            "It encrypts traffic between on-prem and cloud servers",
            "It prevents cloud bills from exceeding a quota",
            "It embeds cloud-specific control logic, linking your cluster to your cloud provider's API (e.g., automatically creating an AWS Load Balancer)"
          ],
          answerIndex: 3,
          explanation: "By separating the cloud-specific code from the core Kubernetes code, cloud providers can update their controllers independently of the main Kubernetes release cycle."
        },
        {
          id: "k8s-1-11",
          question: "What is the declarative approach to managing Kubernetes resources?",
          options: [
            "Using `kubectl exec` to run commands inside containers",
            "Defining the 'desired state' of the system in YAML/JSON files and letting Kubernetes figure out how to achieve and maintain that state",
            "Executing sequential step-by-step commands to create objects",
            "Writing bash scripts that loop through server nodes"
          ],
          answerIndex: 1,
          explanation: "Instead of saying 'Start 3 containers' (Imperative), you say 'Ensure 3 containers are always running' (Declarative via YAML)."
        },
        {
          id: "k8s-1-12",
          question: "What is the Container Runtime Interface (CRI)?",
          options: [
            "A plugin interface which enables kubelet to use a wide variety of container runtimes (like containerd or CRI-O) without needing to recompile Kubernetes",
            "A dashboard for monitoring Docker",
            "An API for scaling databases",
            "A command-line tool"
          ],
          answerIndex: 0,
          explanation: "CRI is why Kubernetes deprecated dockershim; it now communicates cleanly with any OCI-compliant runtime."
        },
        {
          id: "k8s-1-13",
          question: "If a worker node crashes completely, what happens to its Pods?",
          options: [
            "They continue running in memory",
            "The cluster permanently loses them",
            "The control plane notices the node is NotReady and automatically reschedules the lost Pods onto healthy worker nodes",
            "The apiserver crashes"
          ],
          answerIndex: 2,
          explanation: "This self-healing nature is a core feature of Kubernetes. ReplicaSets ensure the desired count is always maintained."
        },
        {
          id: "k8s-1-14",
          question: "What is Minikube?",
          options: [
            "A tool that lets you run Kubernetes locally on your laptop, usually creating a single-node cluster inside a VM or container",
            "A tiny version of Docker",
            "A cloud hosting provider",
            "A miniaturized database engine"
          ],
          answerIndex: 0,
          explanation: "Minikube is perfect for developers wanting to learn and test Kubernetes without paying for expensive cloud clusters."
        },
        {
          id: "k8s-1-15",
          question: "What file does `kubectl` use by default to find the cluster connection and authentication information?",
          options: [
            "/etc/kubernetes/admin.conf",
            "~/.kube/config",
            "~/.ssh/id_rsa",
            "/var/lib/kube.config"
          ],
          answerIndex: 1,
          explanation: "The kubeconfig file contains cluster URLs, user certificates, and context settings, allowing `kubectl` to securely interact with the apiserver."
        },
        {
          id: "k8s-1-16",
          question: "What is the standard format used to define Kubernetes manifests (configuration files)?",
          options: [
            "XML",
            "YAML (or JSON)",
            "TOML",
            "INI"
          ],
          answerIndex: 1,
          explanation: "While Kubernetes accepts JSON, YAML is the human-readable standard universally used for writing Kubernetes manifests."
        },
        {
          id: "k8s-1-17",
          question: "What happens if the `kube-apiserver` goes down?",
          options: [
            "All running applications instantly crash",
            "Worker nodes shut down",
            "You cannot create, delete, or update any resources, but existing Pods will continue to run normally",
            "The etcd database wipes itself"
          ],
          answerIndex: 2,
          explanation: "The data plane (running apps) is decoupled from the control plane. However, without the apiserver, self-healing and scaling will stop functioning until it comes back."
        },
        {
          id: "k8s-1-18",
          question: "Which of the following is a mandatory top-level field in every Kubernetes YAML manifest?",
          options: [
            "apiVersion",
            "replicas",
            "ports",
            "volumes"
          ],
          answerIndex: 0,
          explanation: "Every manifest must include `apiVersion`, `kind`, `metadata`, and `spec` (for most objects)."
        },
        {
          id: "k8s-1-19",
          question: "What is the role of the `kube-controller-manager`?",
          options: [
            "It runs controller processes (like Node controller, Job controller, ReplicaSet controller) that constantly regulate the state of the cluster",
            "It exposes ports to the internet",
            "It manages developer permissions",
            "It installs network plugins"
          ],
          answerIndex: 0,
          explanation: "Controllers run continuous loops, comparing the current state of the cluster to the desired state, and making changes to match them."
        },
        {
          id: "k8s-1-20",
          question: "What underlying Linux feature enables Kubernetes to limit CPU and RAM for a container?",
          options: [
            "Namespaces",
            "cgroups (Control Groups)",
            "chroot jails",
            "SELinux"
          ],
          answerIndex: 1,
          explanation: "While namespaces provide isolation (what a process can see), cgroups provide resource limitation (what a process can use)."
        }
      ]
    },
    {
      level: 2,
      title: "Level 2: Pods, Workloads & Controllers",
      description: "Deployments, StatefulSets, DaemonSets, and container lifecycles.",
      passScore: 16,
      questions: [
        {
          id: "k8s-2-1",
          question: "What is a Pod in Kubernetes?",
          options: [
            "A physical server rack",
            "A group of worker nodes",
            "A database backup",
            "The smallest and simplest Kubernetes object, representing a single instance of a running process in your cluster, which can hold one or more containers"
          ],
          answerIndex: 3,
          explanation: "Containers are not deployed directly in Kubernetes. They are always wrapped inside a Pod, which shares storage, network IP, and port space among its containers."
        },
        {
          id: "k8s-2-2",
          question: "If a Pod hosts multiple containers, how do they communicate with each other?",
          options: [
            "Via external LoadBalancers",
            "They cannot communicate",
            "Via standard localhost (127.0.0.1) since they share the same network namespace",
            "Through a complex BGP protocol"
          ],
          answerIndex: 2,
          explanation: "Because containers in a Pod share the exact same network IP and port space, Container A can talk to Container B on port 8080 just by hitting `localhost:8080`."
        },
        {
          id: "k8s-2-3",
          question: "What does a ReplicaSet ensure?",
          options: [
            "That data is backed up to multiple hard drives",
            "That a specified number of identical Pod replicas are running at any given time",
            "That nodes are duplicated across cloud zones",
            "That containers share the same IP"
          ],
          answerIndex: 1,
          explanation: "If you specify 3 replicas and one Pod crashes, the ReplicaSet instantly creates a new one to replace it."
        },
        {
          id: "k8s-2-4",
          question: "Why should you almost never create bare Pods or ReplicaSets directly?",
          options: [
            "You should use a Deployment, which manages ReplicaSets and provides declarative updates, seamless rollouts, and rollback functionality",
            "Because they are deprecated in newer versions",
            "Because they cost more money",
            "Because they cannot connect to the internet"
          ],
          answerIndex: 0,
          explanation: "A Deployment sits above a ReplicaSet. If you update the image version, the Deployment orchestrates a rolling update seamlessly."
        },
        {
          id: "k8s-2-5",
          question: "How does a 'Rolling Update' strategy work in a Deployment?",
          options: [
            "It turns off the whole cluster, updates, and turns it back on",
            "It replaces old Pods with new Pods progressively, ensuring that a certain number of Pods are always available to handle traffic (zero downtime)",
            "It moves Pods from one node to another",
            "It rolls back to an older version"
          ],
          answerIndex: 1,
          explanation: "Kubernetes spins up a new Pod, waits for it to become ready, and only then terminates an old Pod, continuing this cycle."
        },
        {
          id: "k8s-2-6",
          question: "Which command rolls back a Deployment to its previous version if a bad update breaks the application?",
          options: [
            "kubectl deploy undo",
            "kubectl revert deployment myapp",
            "kubectl rollout undo deployment/myapp",
            "kubectl reset myapp"
          ],
          answerIndex: 2,
          explanation: "Because Deployments keep a history of previous ReplicaSets, rolling back is instant and easy."
        },
        {
          id: "k8s-2-7",
          question: "When should you use a StatefulSet instead of a Deployment?",
          options: [
            "When your app is stateless",
            "When you want to deploy the app faster",
            "When your application requires unique network identifiers, ordered graceful deployment, and persistent storage per Pod (like databases)",
            "When you need to scale beyond 100 Pods"
          ],
          answerIndex: 2,
          explanation: "Deployments treat Pods like cattle (disposable). StatefulSets treat Pods like pets (e.g., `mysql-0`, `mysql-1`), ensuring they keep their identity and attached hard drive if restarted."
        },
        {
          id: "k8s-2-8",
          question: "What is the purpose of a DaemonSet?",
          options: [
            "To schedule a task to run once a week",
            "To ensure that a copy of a specific Pod runs on ALL (or some selected) worker nodes in the cluster",
            "To block malicious daemons",
            "To provide a database cache"
          ],
          answerIndex: 1,
          explanation: "DaemonSets are perfect for infrastructure-level tasks, like running a log collector (Fluentd) or a node monitoring agent on every single server."
        },
        {
          id: "k8s-2-9",
          question: "How does a Kubernetes `Job` differ from a Deployment?",
          options: [
            "A Job is a Deployment that runs forever",
            "A Job creates one or more Pods and ensures they successfully terminate upon completing a specific task, rather than running continuously",
            "A Job cannot have logs",
            "A Job runs on the control plane"
          ],
          answerIndex: 1,
          explanation: "A web server (Deployment) runs forever. A data processing script or database migration (Job) runs, finishes, and successfully exits."
        },
        {
          id: "k8s-2-10",
          question: "What does a `CronJob` do?",
          options: [
            "Creates Jobs on a repeating time-based schedule (e.g., every midnight)",
            "Compresses logs",
            "Deletes old Pods",
            "Monitors the apiserver"
          ],
          answerIndex: 0,
          explanation: "CronJobs use standard cron format (e.g., `0 0 * * *`) to automatically spawn a Job at specific intervals, perfect for nightly backups."
        },
        {
          id: "k8s-2-11",
          question: "What is an `initContainer`?",
          options: [
            "A container used to initialize the cluster",
            "The very first pod scheduled on a node",
            "A specialized container that runs and must complete successfully BEFORE the main application containers in a Pod are allowed to start",
            "A container that deletes itself immediately"
          ],
          answerIndex: 2,
          explanation: "Init containers are excellent for setup tasks, like waiting for a database to become accessible or pulling down a configuration file before the main app boots."
        },
        {
          id: "k8s-2-12",
          question: "What does the `CrashLoopBackOff` status indicate?",
          options: [
            "The Pod is intentionally looping its code",
            "A container repeatedly crashes shortly after starting, and Kubernetes is exponentially delaying (backing off) its restart attempts to save CPU cycles",
            "The cluster is out of memory",
            "The node has been rebooted"
          ],
          answerIndex: 1,
          explanation: "This usually means your application code has a fatal error on startup, or a required configuration/database is missing."
        },
        {
          id: "k8s-2-13",
          question: "What does `ImagePullBackOff` mean?",
          options: [
            "The image was pulled successfully",
            "The image is too large for the node",
            "Kubernetes cannot pull the requested Docker image (e.g., due to a typo in the image name or missing registry credentials)",
            "The container is pulling data from a backup"
          ],
          answerIndex: 2,
          explanation: "If you specify `image: nginx:latestt`, Kubernetes tries to pull it, fails, waits a bit, and tries again, resulting in this status."
        },
        {
          id: "k8s-2-14",
          question: "What is the 'Sidecar Pattern' in Kubernetes?",
          options: [
            "Running a completely separate Pod next to the main Pod",
            "Deploying a secondary container within the SAME Pod to extend or enhance the main container's functionality (e.g., a logging proxy or TLS termination)",
            "Running an app across two clusters",
            "Connecting a physical sidecar to the server"
          ],
          answerIndex: 1,
          explanation: "Because containers in a Pod share the same lifecycle, network, and disk space, a sidecar can easily read the main app's log files and forward them to Elasticsearch."
        },
        {
          id: "k8s-2-15",
          question: "Which field determines how Deployments match and manage their Pods?",
          options: [
            "metadata.name",
            "spec.template",
            "spec.selector.matchLabels",
            "spec.replicas"
          ],
          answerIndex: 2,
          explanation: "A Deployment looks for all Pods bearing specific labels (e.g., `app: my-web-server`). If it finds fewer than the replica count, it creates more."
        },
        {
          id: "k8s-2-16",
          question: "What happens if you manually delete a Pod managed by a Deployment?",
          options: [
            "The Deployment is also deleted",
            "The cluster shuts down",
            "The Deployment's ReplicaSet immediately spins up a brand new Pod to replace the deleted one",
            "Nothing, the Pod stays dead"
          ],
          answerIndex: 2,
          explanation: "This is the essence of desired state reconciliation. The control plane notices the count dropped from 3 to 2, and restores it to 3."
        },
        {
          id: "k8s-2-17",
          question: "What is the invisible 'pause' (or infra) container in every Pod?",
          options: [
            "A container that holds the network and IPC namespaces for the Pod, allowing the actual application containers to die and restart without losing the Pod's IP address",
            "A container that pauses execution during high CPU load",
            "A container used for pausing database transactions",
            "A debugging tool for developers"
          ],
          answerIndex: 0,
          explanation: "The pause container is the very first thing created. It holds the shared environment open so your app containers can come and go inside the Pod."
        },
        {
          id: "k8s-2-18",
          question: "What is an Ephemeral Container?",
          options: [
            "A container that automatically deletes the Pod",
            "A special container injected temporarily into an existing running Pod specifically for troubleshooting and debugging purposes",
            "A container without a file system",
            "A container used for rapid scaling"
          ],
          answerIndex: 1,
          explanation: "If your app uses a distroless image (no shell), you can inject an ephemeral container containing debugging tools into the Pod to inspect it live."
        },
        {
          id: "k8s-2-19",
          question: "Which of the following describes the 'Pod Phase'?",
          options: [
            "High-level states a Pod passes through: Pending, Running, Succeeded, Failed, or Unknown",
            "The speed at which a Pod starts",
            "The current API version of the Pod",
            "The node the Pod is assigned to"
          ],
          answerIndex: 0,
          explanation: "`Pending` means it's waiting to be scheduled or downloading images. `Running` means containers are executing."
        },
        {
          id: "k8s-2-20",
          question: "What is the default `imagePullPolicy` if you specify an image tag of `:latest`?",
          options: [
            "IfNotPresent",
            "Never",
            "Always",
            "Random"
          ],
          answerIndex: 2,
          explanation: "If you use `:latest`, Kubernetes will always check the registry to see if a newer version of the image exists before starting the Pod."
        }
      ]
    },
    {
      level: 3,
      title: "Level 3: Services, Networking & Ingress",
      description: "Exposing applications, DNS, network policies, and load balancing.",
      passScore: 16,
      questions: [
        {
          id: "k8s-3-1",
          question: "What is the primary purpose of a Kubernetes 'Service'?",
          options: [
            "To monitor CPU usage",
            "To provide a stable, unchanging network endpoint (IP address and DNS name) to access a fluctuating group of ephemeral Pods",
            "To execute background scripts",
            "To store persistent data"
          ],
          answerIndex: 1,
          explanation: "Pod IPs change constantly as they crash or are rescheduled. A Service acts as a reliable internal load balancer pointing to the healthy Pods."
        },
        {
          id: "k8s-3-2",
          question: "Which Service type exposes the service on an internal IP, making it only reachable from WITHIN the cluster?",
          options: [
            "LoadBalancer",
            "NodePort",
            "ClusterIP",
            "ExternalName"
          ],
          answerIndex: 2,
          explanation: "ClusterIP is the default service type. It is perfect for backend databases that should never be exposed to the public internet."
        },
        {
          id: "k8s-3-3",
          question: "Which Service type exposes the service on a static port on each Worker Node's IP, allowing external access?",
          options: [
            "ClusterIP",
            "LoadBalancer",
            "ExternalName",
            "NodePort"
          ],
          answerIndex: 3,
          explanation: "If you hit `NodeIP:30005` in your browser, the traffic is forwarded into the cluster to your service. The port range is strictly 30000-32767."
        },
        {
          id: "k8s-3-4",
          question: "Which Service type integrates with a cloud provider's API to automatically provision a public-facing load balancer (e.g., AWS ALB)?",
          options: [
            "ClusterIP",
            "LoadBalancer",
            "NodePort",
            "Ingress"
          ],
          answerIndex: 1,
          explanation: "This is the easiest way to expose an app in AWS/Azure/GCP. The cloud provider automatically gives you a public IP that routes to your NodePorts."
        },
        {
          id: "k8s-3-5",
          question: "What is a 'Headless Service'?",
          options: [
            "A service with no labels",
            "A service created by setting `clusterIP: None`, which returns the individual IP addresses of the backing Pods directly via DNS, rather than providing load balancing",
            "A service that blocks all traffic",
            "A service not assigned to a namespace"
          ],
          answerIndex: 1,
          explanation: "Headless services are heavily used in StatefulSets (like clustered databases) where clients need to connect directly to a specific Pod (like `db-0`), rather than a generic load balancer."
        },
        {
          id: "k8s-3-6",
          question: "What is an 'Ingress' in Kubernetes?",
          options: [
            "A hardware router",
            "An API object that manages external access to the services in a cluster, typically providing HTTP/HTTPS routing, SSL termination, and name-based virtual hosting",
            "A type of persistent volume",
            "A security firewall"
          ],
          answerIndex: 1,
          explanation: "Instead of creating 10 expensive Cloud LoadBalancers for 10 microservices, one Ingress can route traffic to different services based on the URL path (`/api` vs `/web`)."
        },
        {
          id: "k8s-3-7",
          question: "An Ingress resource requires what other component to actually function?",
          options: [
            "A database",
            "An Ingress Controller (like NGINX or Traefik) running in the cluster to satisfy the rules",
            "A NodePort",
            "A specialized OS"
          ],
          answerIndex: 1,
          explanation: "Creating an Ingress YAML does nothing unless an Ingress Controller is actively watching for Ingress rules and updating its proxy configurations."
        },
        {
          id: "k8s-3-8",
          question: "What handles internal DNS resolution (e.g., resolving a Service name like `my-database` to its ClusterIP) in a modern cluster?",
          options: [
            "Google DNS (8.8.8.8)",
            "kube-proxy",
            "CoreDNS",
            "kubelet"
          ],
          answerIndex: 2,
          explanation: "CoreDNS constantly watches the API server. When a new Service is created, it dynamically updates its DNS records so Pods can discover it by name."
        },
        {
          id: "k8s-3-9",
          question: "What is the standard fully qualified domain name (FQDN) structure for a Kubernetes service?",
          options: [
            "service-name.namespace.svc.cluster.local",
            "service-name.local",
            "namespace.service-name.k8s.local",
            "service-name.cluster.local"
          ],
          answerIndex: 0,
          explanation: "If you are in the `dev` namespace trying to hit the `db` service in the `prod` namespace, you must use `db.prod.svc.cluster.local`."
        },
        {
          id: "k8s-3-10",
          question: "How do Services know WHICH Pods to send traffic to?",
          options: [
            "By looking at the Pods' names",
            "By tracking the Pods' MAC addresses",
            "Using a Label Selector (e.g., matching all Pods with `app: web`)",
            "By sending traffic to all Pods randomly"
          ],
          answerIndex: 2,
          explanation: "The Service looks for Pods containing the labels specified in its `selector` field and routes traffic only to those matching Pods."
        },
        {
          id: "k8s-3-11",
          question: "What is the purpose of an 'Endpoints' (or EndpointSlice) object?",
          options: [
            "It holds the actual list of healthy Pod IP addresses that a Service is actively routing traffic to",
            "It defines the internet domain name",
            "It manages SSH access to nodes",
            "It terminates SSL connections"
          ],
          answerIndex: 0,
          explanation: "When you create a Service with a selector, Kubernetes automatically creates an Endpoints object. If a Pod crashes, its IP is instantly removed from the Endpoints list."
        },
        {
          id: "k8s-3-12",
          question: "What is a 'Network Policy'?",
          options: [
            "A billing agreement with your ISP",
            "A specification of how groups of Pods are allowed to communicate with each other and other network endpoints (like a cluster-internal firewall)",
            "A load balancing algorithm",
            "A tool to increase network bandwidth"
          ],
          answerIndex: 1,
          explanation: "By default, all Pods in a cluster can talk to all other Pods. Network Policies use labels to restrict traffic, such as strictly allowing only the backend to talk to the database."
        },
        {
          id: "k8s-3-13",
          question: "What happens if a Network Policy selects a group of Pods but doesn't explicitly allow any traffic?",
          options: [
            "Traffic is fully allowed",
            "The policy is ignored",
            "Those Pods become completely isolated; all incoming and outgoing traffic is denied (Default Deny)",
            "The cluster shuts down"
          ],
          answerIndex: 2,
          explanation: "The moment a Network Policy selects a Pod, it goes into a 'default deny' posture, and you must explicitly whitelist the traffic you want to allow."
        },
        {
          id: "k8s-3-14",
          question: "What is CNI (Container Network Interface)?",
          options: [
            "A standard API that allows different third-party network plugins (like Calico, Flannel, or Cilium) to configure pod networking in Kubernetes",
            "A graphical dashboard for networks",
            "A command-line tool for pinging nodes",
            "A VPN software"
          ],
          answerIndex: 0,
          explanation: "Kubernetes doesn't actually handle the deep networking itself. It delegates IP assignment and routing to the installed CNI plugin."
        },
        {
          id: "k8s-3-15",
          question: "In Service definitions, what is the difference between `port` and `targetPort`?",
          options: [
            "`port` is for UDP, `targetPort` is for TCP",
            "`port` is the port exposed by the Service itself; `targetPort` is the actual port the container application is listening on inside the Pod",
            "They are exact synonyms",
            "`port` is the internet port, `targetPort` is the database port"
          ],
          answerIndex: 1,
          explanation: "You can expose a Service on port 80, but have it forward the traffic to `targetPort: 8080` where your Node.js app is running."
        },
        {
          id: "k8s-3-16",
          question: "What does setting `hostNetwork: true` in a Pod spec do?",
          options: [
            "Creates a new virtual network",
            "Allocates a completely isolated IP",
            "Allows the Pod to use the host node's actual network namespace, giving it the same IP address as the worker node",
            "Blocks internet access"
          ],
          answerIndex: 2,
          explanation: "This is a security risk and is usually only used by system-level components like CNI plugins or Ingress controllers that need to bind directly to host ports."
        },
        {
          id: "k8s-3-17",
          question: "Which `kube-proxy` mode is the most common and intercepts traffic using kernel-level packet filtering?",
          options: [
            "userspace mode",
            "iptables mode (or IPVS mode)",
            "BGP mode",
            "macvlan mode"
          ],
          answerIndex: 1,
          explanation: "kube-proxy writes dozens of iptables rules on every node so that traffic destined for a ClusterIP is magically redirected to the actual Pod IP."
        },
        {
          id: "k8s-3-18",
          question: "What is an `ExternalName` service?",
          options: [
            "A service that maps a Kubernetes service name directly to an external DNS name (like `database.external.com`), acting as a CNAME record without proxying",
            "A public load balancer",
            "An ingress controller",
            "A service exposed on all nodes"
          ],
          answerIndex: 0,
          explanation: "This allows you to change your external database provider without having to rewrite the configuration files of every application in your cluster."
        },
        {
          id: "k8s-3-19",
          question: "How do you secure HTTP traffic entering your cluster via an Ingress?",
          options: [
            "By setting `encryption: true`",
            "By adding a `tls` section to the Ingress spec, referencing a Kubernetes Secret that contains the SSL certificate and private key",
            "By encrypting the nodes",
            "By using ClusterIP"
          ],
          answerIndex: 1,
          explanation: "The Ingress controller (like NGINX) reads this Secret, terminates the SSL connection at the edge, and passes plain HTTP traffic into the cluster."
        },
        {
          id: "k8s-3-20",
          question: "What is 'Service Mesh' (e.g., Istio, Linkerd) commonly used for in Kubernetes?",
          options: [
            "To replace Kubernetes entirely",
            "To provide advanced networking features (mTLS encryption, retries, circuit breaking, tracing) between Pods by injecting sidecar proxies",
            "To provide physical network cables",
            "To host web applications"
          ],
          answerIndex: 1,
          explanation: "Service meshes abstract complex networking logic away from the application code, managing all service-to-service communication via proxies."
        }
      ]
    },
    {
      level: 4,
      title: "Level 4: Storage, Configurations & Secrets",
      description: "PVs, PVCs, ConfigMaps, Secrets, and stateful data management.",
      passScore: 16,
      questions: [
        {
          id: "k8s-4-1",
          question: "What is a ConfigMap?",
          options: [
            "A map of the network architecture",
            "An API object used to store non-confidential data in key-value pairs, keeping environment-specific configuration separate from container images",
            "A routing table for Ingress",
            "A storage volume for databases"
          ],
          answerIndex: 1,
          explanation: "You can inject a ConfigMap into a Pod as environment variables or mount it as physical files inside a directory."
        },
        {
          id: "k8s-4-2",
          question: "What is a Kubernetes Secret?",
          options: [
            "A hidden container",
            "An API object that stores sensitive data, such as passwords, OAuth tokens, and SSH keys",
            "A password for the master node",
            "A hidden log file"
          ],
          answerIndex: 1,
          explanation: "Secrets are similar to ConfigMaps but are specifically intended to hold confidential data securely, reducing the risk of accidental exposure."
        },
        {
          id: "k8s-4-3",
          question: "How are standard Kubernetes Secrets stored in etcd by default?",
          options: [
            "Encrypted with AES-256",
            "Hashed with SHA-512",
            "As Base64 encoded plain text",
            "They are not stored in etcd"
          ],
          answerIndex: 2,
          explanation: "Base64 is an encoding, NOT encryption. Anyone with access to the Secret object can decode it instantly. Encryption at rest must be explicitly configured."
        },
        {
          id: "k8s-4-4",
          question: "What is an `emptyDir` volume?",
          options: [
            "A volume that automatically deletes large files",
            "A temporary volume created when a Pod is assigned to a Node, which is completely deleted forever when the Pod is removed from that node",
            "A cloud block storage",
            "A volume shared across all nodes"
          ],
          answerIndex: 1,
          explanation: "`emptyDir` is excellent for scratch space, temporary caches, or sharing files between multiple containers running inside the exact same Pod."
        },
        {
          id: "k8s-4-5",
          question: "What is a `hostPath` volume?",
          options: [
            "A cloud storage bucket",
            "A volume that mounts a file or directory from the host worker node's actual filesystem directly into the Pod",
            "A volume generated by the apiserver",
            "A volume that hosts a website"
          ],
          answerIndex: 1,
          explanation: "This is inherently dangerous and tied to a specific node. If the Pod is rescheduled to a different node, it won't find the same files. It's usually reserved for system daemonsets."
        },
        {
          id: "k8s-4-6",
          question: "What is a PersistentVolume (PV)?",
          options: [
            "A piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned via StorageClasses",
            "A backup file on a developer's machine",
            "A volume that survives cluster deletion",
            "A hard drive installed in the master node only"
          ],
          answerIndex: 0,
          explanation: "A PV is a cluster-level resource that abstracts the underlying physical storage (like an AWS EBS volume or an NFS share)."
        },
        {
          id: "k8s-4-7",
          question: "What is a PersistentVolumeClaim (PVC)?",
          options: [
            "A billing statement for cloud storage",
            "A request for storage by a user/Pod, specifying size and access modes, which the cluster attempts to bind to an available PV",
            "An error indicating a full hard drive",
            "A command to format a volume"
          ],
          answerIndex: 1,
          explanation: "Developers don't care what hard drive they get. They just create a PVC saying 'I need 10GB'. Kubernetes finds a 10GB PV and binds them together."
        },
        {
          id: "k8s-4-8",
          question: "What does the `ReadWriteOnce` (RWO) access mode signify?",
          options: [
            "The volume can only be read once and then is deleted",
            "The volume can be mounted as read-write by a single Node in the cluster",
            "The volume can be written to by multiple nodes simultaneously",
            "The volume is read-only"
          ],
          answerIndex: 1,
          explanation: "RWO is common for block storage (like AWS EBS). If a Pod on Node A attaches it, no Pod on Node B can mount it simultaneously."
        },
        {
          id: "k8s-4-9",
          question: "What does the `ReadWriteMany` (RWX) access mode signify?",
          options: [
            "The volume can be mounted as read-write by many Nodes simultaneously",
            "The volume can be overwritten many times",
            "The volume is heavily encrypted",
            "The volume supports multiple file systems"
          ],
          answerIndex: 0,
          explanation: "RWX is typically supported by file-based network storage like NFS or AWS EFS, allowing multiple web servers across different nodes to share the same uploaded images."
        },
        {
          id: "k8s-4-10",
          question: "What is a 'StorageClass'?",
          options: [
            "A class of users who have storage permissions",
            "A way for administrators to describe the 'classes' of storage they offer, enabling dynamic provisioning of PVs upon PVC creation",
            "A data type in YAML",
            "A categorization of memory usage"
          ],
          answerIndex: 1,
          explanation: "Instead of manually creating PVs in advance, a user requests a PVC with `storageClassName: fast-ssd`, and the cloud provider automatically creates the drive on the fly."
        },
        {
          id: "k8s-4-11",
          question: "What does the PV Reclaim Policy `Retain` do?",
          options: [
            "Keeps the volume mounted permanently",
            "When the PVC is deleted, the PV is not deleted; it remains 'Released' so administrators can manually recover the physical data",
            "Deletes the volume to retain cluster space",
            "Retains the Pod preventing it from crashing"
          ],
          answerIndex: 1,
          explanation: "Dynamic provisioning usually defaults to the `Delete` policy (deleting the AWS volume if the PVC is deleted). `Retain` acts as a safety net against accidental data loss."
        },
        {
          id: "k8s-4-12",
          question: "What is the Container Storage Interface (CSI)?",
          options: [
            "A standard API that allows storage vendors to write plugins to expose their storage systems to Kubernetes without adding code to the core Kubernetes repository",
            "A tool for scanning container security",
            "A UI dashboard for viewing disk space",
            "A command-line tool"
          ],
          answerIndex: 0,
          explanation: "CSI moved storage drivers 'out-of-tree'. If NetApp creates a new storage array, they just write a CSI driver, and it works with Kubernetes instantly."
        },
        {
          id: "k8s-4-13",
          question: "If a ConfigMap is mounted as a file volume inside a Pod, what happens when the ConfigMap is updated?",
          options: [
            "The Pod instantly crashes",
            "The file inside the running Pod is automatically updated after a short delay, allowing applications to hot-reload configuration",
            "The Pod must be deleted and recreated to see the changes",
            "The ConfigMap becomes locked"
          ],
          answerIndex: 1,
          explanation: "Volume-mounted ConfigMaps/Secrets are updated live by the kubelet. Note: Environment variables injected from ConfigMaps do NOT update automatically."
        },
        {
          id: "k8s-4-14",
          question: "What is the purpose of marking a ConfigMap or Secret as `immutable: true`?",
          options: [
            "It encrypts the data",
            "It prevents accidental updates and drastically improves cluster performance because the kubelet doesn't have to constantly watch it for changes",
            "It deletes the object after use",
            "It shares the object across namespaces"
          ],
          answerIndex: 1,
          explanation: "If you need a new config, you create a new Immutable ConfigMap and roll out a new Deployment. This is safer and highly performant."
        },
        {
          id: "k8s-4-15",
          question: "How can you inject specific keys from a Secret into a container's environment variables?",
          options: [
            "Using `envFrom` or `valueFrom: secretKeyRef` in the Pod spec",
            "By writing a bash script in the image",
            "By mounting it as a volume",
            "By hardcoding the base64 string"
          ],
          answerIndex: 0,
          explanation: "This allows you to map a specific database password from a Secret directly into the `DB_PASS` environment variable inside the container."
        },
        {
          id: "k8s-4-16",
          question: "What is a 'Projected Volume'?",
          options: [
            "A 3D visualization of storage",
            "A volume that maps several existing volume sources (like multiple ConfigMaps and Secrets) into a single directory structure in the Pod",
            "A volume that estimates future growth",
            "A volume hosted outside the cluster"
          ],
          answerIndex: 1,
          explanation: "If you need a password file and a config file to live in the same `/etc/app/` folder, a Projected Volume seamlessly merges them."
        },
        {
          id: "k8s-4-17",
          question: "What is the `subPath` property used for in a volume mount?",
          options: [
            "To mount a volume to a submarine node",
            "To mount a single specific file or subdirectory from a volume into the container, rather than mounting the entire root of the volume",
            "To compress the volume",
            "To mount a volume asynchronously"
          ],
          answerIndex: 1,
          explanation: "Without `subPath`, mounting a ConfigMap to `/etc/nginx/` would overwrite and hide every other existing file in that nginx directory."
        },
        {
          id: "k8s-4-18",
          question: "How do StatefulSets provide unique storage to each replica (e.g., `db-0` gets disk A, `db-1` gets disk B)?",
          options: [
            "Using VolumeClaimTemplates",
            "Using manual PVC creation",
            "Using emptyDirs",
            "Using standard Deployment specs"
          ],
          answerIndex: 0,
          explanation: "The `volumeClaimTemplates` field ensures that every time the StatefulSet spins up a new replica, it dynamically provisions a unique, dedicated PVC just for that specific Pod."
        },
        {
          id: "k8s-4-19",
          question: "Which of the following describes a `Local` persistent volume?",
          options: [
            "A volume mounted on the user's laptop",
            "A PV that directly represents a local disk or partition tightly bound to a specific node, offering high performance for databases but losing the data if the node dies",
            "A temporary cache in RAM",
            "A volume shared on a Local Area Network"
          ],
          answerIndex: 1,
          explanation: "Local volumes are often used for highly replicated distributed databases (like Cassandra or Ceph) that handle their own data replication across nodes."
        },
        {
          id: "k8s-4-20",
          question: "What happens if a Pod requests a PVC that does not exist and cannot be dynamically provisioned?",
          options: [
            "The Pod starts without storage",
            "The Pod crashes instantly",
            "The Pod remains stuck in the `Pending` state indefinitely, emitting `FailedScheduling` events until the PVC is bound",
            "The cluster shuts down"
          ],
          answerIndex: 2,
          explanation: "The scheduler will refuse to place the Pod on a node until all of its required volume claims are satisfied and available."
        }
      ]
    },
    {
      level: 5,
      title: "Level 5: Scheduling, Probes & Node Management",
      description: "Resource requests, limits, health checks, taints, and affinity.",
      passScore: 16,
      questions: [
        {
          id: "k8s-5-1",
          question: "In a container spec, what does a CPU 'Request' signify?",
          options: [
            "The maximum CPU the container can ever use",
            "The minimum amount of CPU that the scheduler guarantees is available on a node before it places the Pod there",
            "The number of CPU cores to dedicate exclusively",
            "The time it takes to boot"
          ],
          answerIndex: 1,
          explanation: "Requests are used strictly for scheduling. If a node only has 1 CPU available, and your Pod requests 2 CPUs, the Pod will remain Pending."
        },
        {
          id: "k8s-5-2",
          question: "What happens if a container exceeds its Memory 'Limit'?",
          options: [
            "It is throttled and runs slower",
            "It receives an OOMKilled (Out of Memory) signal and is immediately terminated by the kernel",
            "It borrows memory from another container",
            "It pauses until memory frees up"
          ],
          answerIndex: 1,
          explanation: "CPU is a compressible resource, so exceeding CPU limits just causes CPU throttling. Memory cannot be compressed, so exceeding limits causes a hard crash."
        },
        {
          id: "k8s-5-3",
          question: "What is the purpose of a Liveness Probe?",
          options: [
            "To check if the user is active",
            "To determine if a container is running properly. If the probe fails, the kubelet kills the container and restarts it",
            "To route traffic to the container",
            "To scale the number of replicas"
          ],
          answerIndex: 1,
          explanation: "If an application hits a deadlock and stops responding but doesn't crash, the Liveness Probe catches it and restarts the frozen container automatically."
        },
        {
          id: "k8s-5-4",
          question: "What is the purpose of a Readiness Probe?",
          options: [
            "To restart the container",
            "To determine if a container is ready to accept HTTP traffic. If it fails, the endpoint controller removes the Pod's IP from all Services",
            "To download images before starting",
            "To check if the database is backed up"
          ],
          answerIndex: 1,
          explanation: "A Java app might take 30 seconds to warm up. You don't want users routed to it until it's actually ready. The Readiness Probe prevents premature routing."
        },
        {
          id: "k8s-5-5",
          question: "What does the Startup Probe do?",
          options: [
            "Deletes the Pod after startup",
            "Disables Liveness and Readiness probes until the Startup Probe succeeds, preventing extremely slow-starting apps from being repeatedly killed by impatience",
            "Runs a script on the host node",
            "Checks the startup time of the cluster"
          ],
          answerIndex: 1,
          explanation: "If a legacy app takes 3 minutes to load its cache, a Liveness probe might kill it after 1 minute. A Startup probe protects it during this initial boot phase."
        },
        {
          id: "k8s-5-6",
          question: "What is `nodeSelector` used for?",
          options: [
            "Selecting an API version",
            "A simple field in the Pod spec that forces the Pod to only be scheduled on nodes that possess matching labels (e.g., `disktype: ssd`)",
            "Selecting pods to delete",
            "Choosing the cluster master"
          ],
          answerIndex: 1,
          explanation: "This is the simplest way to constrain pods to nodes, but lacks the expressiveness (like soft preferences) of Node Affinity."
        },
        {
          id: "k8s-5-7",
          question: "What is Node Affinity?",
          options: [
            "A physical connection between nodes",
            "An advanced scheduling feature that allows you to specify hard requirements (`requiredDuringScheduling...`) or soft preferences (`preferredDuringScheduling...`) for placing Pods on specific nodes",
            "A tool for encrypting node traffic",
            "A method to delete empty nodes"
          ],
          answerIndex: 1,
          explanation: "Affinity allows complex rules using operators like `In`, `NotIn`, `Exists`. A soft preference tries to place the pod on an SSD node, but falls back to HDD if necessary."
        },
        {
          id: "k8s-5-8",
          question: "What are Node 'Taints'?",
          options: [
            "Corrupted data on a hard drive",
            "Properties applied to a Node that repel Pods, preventing Pods from being scheduled on them unless the Pod possesses a matching Toleration",
            "Viruses affecting the kubelet",
            "Labels used for load balancing"
          ],
          answerIndex: 1,
          explanation: "Taints are 'defensive'. A GPU node might be tainted so that random web-server pods don't get scheduled on it and waste the expensive GPU hardware."
        },
        {
          id: "k8s-5-9",
          question: "What are 'Tolerations'?",
          options: [
            "Permissions to use more RAM",
            "Rules applied to a Pod allowing (but not forcing) the Pod to be scheduled onto a Node with matching Taints",
            "Waiting periods before a Pod crashes",
            "Network timeout limits"
          ],
          answerIndex: 1,
          explanation: "If Node A has taint `gpu=true:NoSchedule`, a Pod will only be placed on Node A if it has the exact `gpu=true` toleration."
        },
        {
          id: "k8s-5-10",
          question: "Which Taint effect actively evicts (kicks off) existing running Pods from a Node if they do not tolerate the taint?",
          options: [
            "NoSchedule",
            "PreferNoSchedule",
            "NoExecute",
            "NoRunning"
          ],
          answerIndex: 2,
          explanation: "`NoSchedule` only prevents new pods. `NoExecute` is aggressive; it immediately terminates existing pods that lack the toleration."
        },
        {
          id: "k8s-5-11",
          question: "What does Pod Anti-Affinity accomplish?",
          options: [
            "It forces pods to run on the same node",
            "It tells the scheduler to avoid placing a Pod on a node (or in a zone) if that node already runs a Pod matching a specific label",
            "It deletes pods that are too similar",
            "It isolates namespaces"
          ],
          answerIndex: 1,
          explanation: "This is crucial for High Availability. You use Anti-Affinity to ensure that all 3 replicas of your database aren't accidentally placed on the exact same physical node."
        },
        {
          id: "k8s-5-12",
          question: "What is a 'Static Pod'?",
          options: [
            "A Pod created directly by the kubelet based on a YAML file placed in a specific directory on the node, entirely bypassing the API server and scheduler",
            "A Pod that cannot communicate over the network",
            "A Pod running a frontend website",
            "A Pod whose IP address never changes"
          ],
          answerIndex: 0,
          explanation: "Static Pods are how the Kubernetes control plane boots itself. The kubelet reads a folder and starts the apiserver, etcd, and scheduler as static pods."
        },
        {
          id: "k8s-5-13",
          question: "What is the Horizontal Pod Autoscaler (HPA)?",
          options: [
            "A tool that adds more RAM to a node",
            "A controller that automatically updates a Deployment's replica count (scaling out or in) based on observed metrics like CPU utilization or custom metrics",
            "A tool that balances network loads",
            "A physical hardware scaler"
          ],
          answerIndex: 1,
          explanation: "If CPU hits 80%, the HPA changes the replica count from 3 to 10. When traffic drops, it scales back down to 3."
        },
        {
          id: "k8s-5-14",
          question: "What component is absolutely required for the HPA to function based on CPU/Memory?",
          options: [
            "Prometheus",
            "Metrics Server",
            "CoreDNS",
            "Ingress Controller"
          ],
          answerIndex: 1,
          explanation: "The Metrics Server aggregates resource usage data from the kubelets and exposes it via the Metrics API, which the HPA queries to make scaling decisions."
        },
        {
          id: "k8s-5-15",
          question: "What does the Vertical Pod Autoscaler (VPA) do?",
          options: [
            "Increases the number of Pods",
            "Automatically adjusts the CPU and Memory Requests/Limits of your Pods, restarting them with the newly optimized values",
            "Adds more worker nodes to the cluster",
            "Changes the node architecture"
          ],
          answerIndex: 1,
          explanation: "While HPA adds *more* Pods, VPA makes existing Pods *bigger* (giving them more RAM if they keep crashing)."
        },
        {
          id: "k8s-5-16",
          question: "What is the Cluster Autoscaler?",
          options: [
            "It provisions entirely new clusters",
            "It automatically provisions new physical/virtual Worker Nodes from the cloud provider when Pods fail to schedule due to resource shortages",
            "It increases the size of the master node",
            "It scales the number of namespaces"
          ],
          answerIndex: 1,
          explanation: "If the HPA scales to 50 Pods and the current nodes are full, the Pods go to Pending. The Cluster Autoscaler sees this and buys a new EC2 instance from AWS."
        },
        {
          id: "k8s-5-17",
          question: "What is a PodDisruptionBudget (PDB)?",
          options: [
            "A financial budget for cloud costs",
            "A policy that limits the number of concurrent voluntary disruptions (like node draining or upgrades) a replicated application experiences, ensuring high availability",
            "A tool to cause intentional chaos",
            "A limit on memory usage"
          ],
          answerIndex: 1,
          explanation: "If you set `minAvailable: 2`, an administrator trying to drain a node will be blocked if doing so would drop the available replicas below 2."
        },
        {
          id: "k8s-5-18",
          question: "What is 'Node Pressure Eviction'?",
          options: [
            "A tool to compress node data",
            "When a node is critically low on resources (like Disk Space or Memory), the kubelet actively kills and evicts Pods to reclaim resources and prevent a node crash",
            "When users apply pressure to the API",
            "A network congestion error"
          ],
          answerIndex: 1,
          explanation: "If a node's disk hits 90%, it will start terminating Pods. The RepliaSet will then reschedule those Pods onto other, healthier nodes."
        },
        {
          id: "k8s-5-19",
          question: "What are `PriorityClasses` used for?",
          options: [
            "Prioritizing network packets",
            "Assigning an integer priority to Pods. High-priority Pods can 'preempt' (evict) lower-priority Pods if the cluster is full and resources are needed",
            "Prioritizing API server requests",
            "Billing tier classifications"
          ],
          answerIndex: 1,
          explanation: "This ensures that critical system services (like logging or core databases) get scheduled immediately, even if it means killing a batch processing job to make room."
        },
        {
          id: "k8s-5-20",
          question: "If you specify `nodeName: worker-node-1` directly in a Pod spec, what happens?",
          options: [
            "The node name is changed",
            "The pod is scheduled normally by the scheduler",
            "The Kubernetes Scheduler is completely bypassed, and the Pod is forcefully assigned to that exact node, even if the node lacks resources",
            "The cluster rejects the manifest"
          ],
          answerIndex: 2,
          explanation: "This is a form of manual scheduling. It is generally an anti-pattern because if `worker-node-1` dies, the Pod is permanently stuck, defeating orchestration."
        }
      ]
    },
    {
      level: 6,
      title: "Level 6: Advanced ORM & Database Optimization",
      description: "QuerySet optimization, F/Q objects, and database transactions.",
      passScore: 16,
      questions: [
        {
          id: "dj-6-1",
          question: "How do you solve the 'N+1 Query Problem' when iterating over a QuerySet that accesses a ForeignKey (One-to-Many) relationship?",
          options: [
            "Use `.join_tables()`",
            "Use `.fetch_foreign()`",
            "Use `.select_related('related_model')`",
            "Use `.prefetch_related('related_model')`"
          ],
          answerIndex: 2,
          explanation: "`select_related()` performs an SQL INNER JOIN and retrieves the related object data in a single complex query, perfect for single-valued relationships (ForeignKey or OneToOne)."
        },
        {
          id: "dj-6-2",
          question: "How do you solve the 'N+1 Query Problem' for Many-to-Many or Reverse ForeignKey relationships?",
          options: [
            "Use `.select_related()`",
            "Use `.prefetch_related()`",
            "Use `.get_many()`",
            "Use `.join()`"
          ],
          answerIndex: 1,
          explanation: "`prefetch_related()` executes a separate query for each relationship and does the 'joining' in Python, which is required for multi-valued relationships where a JOIN would return massive duplicate rows."
        },
        {
          id: "dj-6-3",
          question: "What is the purpose of the `Q` object in Django ORM?",
          options: [
            "To queue database queries for later execution",
            "To encapsulate a collection of keyword arguments, allowing you to use logical OR (`|`) and NOT (`~`) operators in your `filter()` statements",
            "To quit a database transaction",
            "To query the database using raw SQL"
          ],
          answerIndex: 1,
          explanation: "Normally, passing multiple arguments to `.filter()` combines them with an AND operator. To do an OR query (e.g., title='A' OR title='B'), you must use `Q(title='A') | Q(title='B')`."
        },
        {
          id: "dj-6-4",
          question: "What does the `F` object do in Django ORM?",
          options: [
            "It formats strings for the database",
            "It filters out null values automatically",
            "It forces the database to evaluate a query immediately",
            "It allows you to reference the value of a model field directly in a query without pulling the data into Python memory first"
          ],
          answerIndex: 3,
          explanation: "`Product.objects.update(price=F('price') + 10)` tells the database engine to increase the price by 10, avoiding race conditions and saving memory."
        },
        {
          id: "dj-6-5",
          question: "What is the difference between `aggregate()` and `annotate()`?",
          options: [
            "`annotate()` returns a dictionary for the whole table; `aggregate()` returns a QuerySet",
            "`aggregate()` summarizes values over the entire QuerySet (returning a dictionary); `annotate()` adds an aggregate summary to each individual object in the QuerySet",
            "They are the exact same thing",
            "`aggregate()` modifies the database, `annotate()` modifies the view"
          ],
          answerIndex: 1,
          explanation: "Use `aggregate(Avg('price'))` to get the average price of ALL books. Use `annotate(num_authors=Count('authors'))` to attach a specific author count to EACH book object."
        },
        {
          id: "dj-6-6",
          question: "How do you execute raw SQL queries that map back to your Django models?",
          options: [
            "Model.objects.raw('SELECT * FROM my_table')",
            "Model.objects.execute('SELECT * FROM my_table')",
            "Model.objects.sql('SELECT * FROM my_table')",
            "Model.objects.run('SELECT * FROM my_table')"
          ],
          answerIndex: 0,
          explanation: "The `.raw()` method allows you to write raw SQL that still returns instances of your Django model."
        },
        {
          id: "dj-6-7",
          question: "How do you ensure a block of code (like transferring money between accounts) either completely succeeds or completely fails, leaving no partial data?",
          options: [
            "Wrap it in a try-except block",
            "Wrap it using `with transaction.atomic():`",
            "Set `AUTOCOMMIT = False` in settings.py",
            "Use the `@safe_query` decorator"
          ],
          answerIndex: 1,
          explanation: "`transaction.atomic()` creates a database transaction. If an exception is thrown inside the block, Django automatically rolls back the database to its previous state."
        },
        {
          id: "dj-6-8",
          question: "What does the `bulk_create()` method do?",
          options: [
            "Creates a massive SQL database dump",
            "Inserts a list of model instances into the database using a single SQL INSERT query, dramatically improving performance",
            "Creates multiple tables at once",
            "Saves a form with multiple fields"
          ],
          answerIndex: 1,
          explanation: "Instead of calling `.save()` inside a for-loop 10,000 times (which runs 10,000 queries), `bulk_create()` passes them all to the database at once."
        },
        {
          id: "dj-6-9",
          question: "What is a major limitation of using `bulk_create()` or `update()`?",
          options: [
            "They do not call the model's `save()` method, and therefore `pre_save` and `post_save` signals are not triggered",
            "They only work with PostgreSQL",
            "They can only insert a maximum of 10 records",
            "They automatically delete existing data"
          ],
          answerIndex: 0,
          explanation: "If you rely on overridden `save()` methods (e.g., to hash a password or calculate a slug), bulk operations bypass them for speed."
        },
        {
          id: "dj-6-10",
          question: "What does `update_or_create()` do?",
          options: [
            "Deletes the object if it exists, creates it if it doesn't",
            "Updates an object if it matches the given criteria, otherwise creates a new object with the provided defaults",
            "Creates an object if the database is locked",
            "Throws an error if the object already exists"
          ],
          answerIndex: 1,
          explanation: "This convenience method prevents you from writing verbose `try... except DoesNotExist` logic when syncing data from an external API."
        },
        {
          id: "dj-6-11",
          question: "How do you limit a QuerySet so it only retrieves specific columns from the database (saving memory and bandwidth)?",
          options: [
            "Model.objects.limit('title', 'date')",
            "Model.objects.columns('title', 'date')",
            "Model.objects.only('title', 'date')",
            "Model.objects.select('title', 'date')"
          ],
          answerIndex: 2,
          explanation: "`only()` restricts the SQL `SELECT` statement. If you later try to access a field you didn't include in `only()`, Django will trigger an extra database query to fetch it (Deferred loading)."
        },
        {
          id: "dj-6-12",
          question: "What is the inverse of the `.only()` method?",
          options: [
            ".exclude_cols()",
            ".defer()",
            ".drop()",
            ".ignore()"
          ],
          answerIndex: 1,
          explanation: "`defer('bio')` tells Django to retrieve everything EXCEPT the 'bio' column. This is useful for delaying the loading of massive text or binary fields."
        },
        {
          id: "dj-6-13",
          question: "What does the `.values()` method return?",
          options: [
            "A dictionary of field definitions",
            "A QuerySet that returns dictionaries instead of model instances, representing the database rows directly",
            "A flat list of string values",
            "The total number of rows"
          ],
          answerIndex: 1,
          explanation: "`values()` is extremely fast and memory-efficient because it skips the overhead of instantiating complex Django Model objects, returning pure data dictionaries."
        },
        {
          id: "dj-6-14",
          question: "What is the primary use case for `.values_list(flat=True)`?",
          options: [
            "To retrieve a QuerySet containing a single, flat Python list of values for a specific field, rather than a list of tuples or dictionaries",
            "To flatten related tables into one table",
            "To remove duplicates from the database",
            "To export the database to a CSV"
          ],
          answerIndex: 0,
          explanation: "`User.objects.values_list('email', flat=True)` returns `['a@a.com', 'b@b.com']` instead of `[('a@a.com',), ('b@b.com',)]`."
        },
        {
          id: "dj-6-15",
          question: "If you call `len(queryset)` vs `queryset.count()`, which is more efficient if you ONLY want to know the number of rows?",
          options: [
            "They perform the exact same operation",
            "len(queryset)",
            "queryset.count()",
            "Neither, you should use `count(queryset)`"
          ],
          answerIndex: 2,
          explanation: "`count()` performs an optimized `SELECT COUNT(*)` at the database level. `len()` pulls every single row into Python memory and then counts them."
        },
        {
          id: "dj-6-16",
          question: "What does the `exists()` method do on a QuerySet?",
          options: [
            "Creates the table if it does not exist",
            "Returns True if the QuerySet contains any results, using a highly optimized SQL query that avoids fetching actual data rows",
            "Checks if the database is running",
            "Throws an error if the data is missing"
          ],
          answerIndex: 1,
          explanation: "Use `if queryset.exists():` instead of `if queryset:` when you don't actually need the data itself, as it is much faster."
        },
        {
          id: "dj-6-17",
          question: "How do you lock a row in the database to prevent other transactions from modifying it until your transaction is finished?",
          options: [
            "Model.objects.lock_row()",
            "Model.objects.prevent_updates()",
            "Model.objects.select_for_update()",
            "Model.objects.hold()"
          ],
          answerIndex: 2,
          explanation: "`select_for_update()` generates a `SELECT ... FOR UPDATE` SQL query. It must be used inside a `transaction.atomic()` block."
        },
        {
          id: "dj-6-18",
          question: "What does the `Meta` option `indexes` do in a Django Model?",
          options: [
            "Defines secondary database indexes (e.g., B-Trees) for specific columns or combinations of columns to significantly speed up read queries",
            "Orders the admin panel list",
            "Generates HTML anchor tags",
            "Creates foreign key constraints automatically"
          ],
          answerIndex: 0,
          explanation: "Adding `models.Index(fields=['last_name', 'first_name'])` ensures lookups by those names are nearly instantaneous."
        },
        {
          id: "dj-6-19",
          question: "What is a 'Manager' in a Django model?",
          options: [
            "A user role with administrative access",
            "A script that restarts the server",
            "The interface through which database query operations are provided to Django models (e.g., the `objects` attribute)",
            "A task queue runner"
          ],
          answerIndex: 2,
          explanation: "You can write custom Managers. For example, replacing `objects` with a manager that automatically filters out soft-deleted records."
        },
        {
          id: "dj-6-20",
          question: "How does Django handle 'Soft Deleting' natively?",
          options: [
            "Django does not have native soft delete; you must implement it yourself (e.g., adding an `is_deleted` boolean field and a custom Manager)",
            "By calling `Model.objects.soft_delete()`",
            "By enabling `SOFT_DELETE=True` in settings.py",
            "By setting the ID to a negative number"
          ],
          answerIndex: 0,
          explanation: "Unlike Laravel, Django requires you to write or install a third-party package (like django-safedelete) to implement Soft Deletion architecture."
        }
      ]
    },
    {
      level: 7,
      title: "Level 7: Authentication & The Admin",
      description: "Custom users, permissions, and admin dashboard customization.",
      passScore: 16,
      questions: [
        {
          id: "dj-7-1",
          question: "What is the recommended best practice for starting a new Django project regarding the User model?",
          options: [
            "Always use the built-in `django.contrib.auth.models.User`",
            "Always create a custom User model that inherits from `AbstractUser` and set `AUTH_USER_MODEL`, even if you don't need extra fields right away",
            "Delete the authentication app entirely",
            "Use a NoSQL database for users"
          ],
          answerIndex: 1,
          explanation: "Switching to a custom user model halfway through a project's lifecycle is incredibly difficult. Starting with a custom `AbstractUser` ensures future flexibility."
        },
        {
          id: "dj-7-2",
          question: "What is the difference between `AbstractUser` and `AbstractBaseUser`?",
          options: [
            "`AbstractBaseUser` includes all default fields (first_name, email, permissions); `AbstractUser` only provides password and last_login",
            "`AbstractUser` includes all default fields (like username, email, and permissions); `AbstractBaseUser` is a bare-bones class offering only authentication core features (password and last_login)",
            "`AbstractUser` is deprecated",
            "There is no difference"
          ],
          answerIndex: 1,
          explanation: "If you want to use 'email' as your login credential instead of 'username', you generally inherit from `AbstractBaseUser` and build the fields from scratch."
        },
        {
          id: "dj-7-3",
          question: "How do you log a user in programmatically after authenticating their credentials?",
          options: [
            "request.session['user'] = user",
            "user.login()",
            "auth.login(request, user)",
            "set_cookie('user', user.id)"
          ],
          answerIndex: 2,
          explanation: "The `login()` function from `django.contrib.auth` attaches the user's ID to the current HTTP session, logging them in."
        },
        {
          id: "dj-7-4",
          question: "Which of the following checks if a user is currently logged in inside a View?",
          options: [
            "if request.user.is_active:",
            "if request.user.is_authenticated:",
            "if request.session.active:",
            "if request.is_logged_in:"
          ],
          answerIndex: 1,
          explanation: "`is_authenticated` is a property on the User model that returns True for actual users, and False for AnonymousUsers."
        },
        {
          id: "dj-7-5",
          question: "How do you enforce that a user MUST be logged in to access a Class-Based View?",
          options: [
            "Set `login_required = True` in the class",
            "Inherit from `LoginRequiredMixin` (placed first in the inheritance list)",
            "Add `@login_required` above the class definition",
            "Override the `get()` method only"
          ],
          answerIndex: 1,
          explanation: "The `LoginRequiredMixin` intercepts the request before it hits the view methods, redirecting unauthenticated users to the login URL."
        },
        {
          id: "dj-7-6",
          question: "What does Django's `@permission_required('blog.add_post')` decorator do?",
          options: [
            "Redirects to a 403 Forbidden page or the login page if the user does not possess the required permission",
            "Grants the user the permission automatically",
            "Logs the user out",
            "Throws a 500 server error"
          ],
          answerIndex: 0,
          explanation: "It is the permission-specific equivalent of `@login_required`, used on function-based views."
        },
        {
          id: "dj-7-7",
          question: "How do you register a Model to appear in the Django Admin interface?",
          options: [
            "Add it to `settings.py`",
            "Run a management command",
            "It appears automatically",
            "In `admin.py`, use `admin.site.register(MyModel)`"
          ],
          answerIndex: 3,
          explanation: "This simple line of code generates a complete graphical CRUD interface for the model."
        },
        {
          id: "dj-7-8",
          question: "If you want to customize how a Model is displayed in the Admin panel, what must you create?",
          options: [
            "A subclass of `admin.ModelAdmin` and register it alongside the model",
            "A custom HTML template in the root directory",
            "A subclass of `models.Model`",
            "A new Django app"
          ],
          answerIndex: 0,
          explanation: "Example: `class PostAdmin(admin.ModelAdmin):` followed by `admin.site.register(Post, PostAdmin)`."
        },
        {
          id: "dj-7-9",
          question: "In a `ModelAdmin` class, what does the `list_display` tuple do?",
          options: [
            "Determines which columns are shown in the main list view of the admin panel",
            "Filters the list of models",
            "Creates a dropdown menu",
            "Restricts access to specific users"
          ],
          answerIndex: 0,
          explanation: "By default, the admin only shows the `__str__` representation of the object. `list_display = ('title', 'author', 'created_at')` creates a highly readable table."
        },
        {
          id: "dj-7-10",
          question: "What does the `search_fields` attribute do in `ModelAdmin`?",
          options: [
            "Replaces the database with a search engine",
            "Scrapes the internet for data",
            "Adds a search box to the admin list view that searches across the specified text fields (e.g., `search_fields = ['title', 'content']`)",
            "Sorts the table alphabetically"
          ],
          answerIndex: 2,
          explanation: "It generates a SQL `LIKE` query behind the scenes, allowing admins to instantly find specific records in massive tables."
        },
        {
          id: "dj-7-11",
          question: "What is an `InlineModelAdmin` (e.g., `TabularInline` or `StackedInline`)?",
          options: [
            "A way to write CSS inline",
            "A feature that allows you to edit models related by a ForeignKey directly on the parent model's admin page (e.g., editing a Book's Chapters on the Book page)",
            "A method to group admin views",
            "A way to write SQL inside the admin"
          ],
          answerIndex: 1,
          explanation: "Inlines vastly improve data entry workflows by combining parent and child model creation onto a single screen."
        },
        {
          id: "dj-7-12",
          question: "What does the `is_staff` flag do on the Django User model?",
          options: [
            "It grants the user access to log into the Django Admin interface",
            "It gives the user maximum Superuser privileges",
            "It prevents the user from being deleted",
            "It gives the user a monthly paycheck"
          ],
          answerIndex: 0,
          explanation: "Normal users cannot access the `/admin/` portal at all, even if they have specific permissions, unless `is_staff` is True."
        },
        {
          id: "dj-7-13",
          question: "How can you run a custom function when a user clicks a checkbox in the Admin list view and selects an action from the dropdown?",
          options: [
            "By writing JavaScript in the admin templates",
            "By defining a custom 'Admin Action' function and adding it to the `actions` list on the ModelAdmin",
            "By modifying the core Django source code",
            "By overriding the `save_model` method"
          ],
          answerIndex: 1,
          explanation: "Custom actions are powerful. You can write a function `make_published` that takes a QuerySet and updates `status='published'` for all selected rows instantly."
        },
        {
          id: "dj-7-14",
          question: "What does `User.set_password(raw_password)` do?",
          options: [
            "Saves the password as plain text in the database",
            "Takes a raw string, securely hashes it using Django's configured hashing algorithm (e.g., PBKDF2), and assigns the hash to the user object",
            "Sends a password reset email",
            "Requires the user to enter their old password"
          ],
          answerIndex: 1,
          explanation: "You must ALWAYS use `set_password()` or `create_user()`. If you do `user.password = '1234'; user.save()`, they will never be able to log in, because '1234' is not a valid hash."
        },
        {
          id: "dj-7-15",
          question: "What is the `MustVerifyEmail` trait (or similar functionality) used for?",
          options: [
            "Sending newsletters",
            "Ensuring a user clicks a confirmation link sent to their inbox before they are allowed to access protected routes",
            "Checking if an email exists in the database",
            "Formatting emails"
          ],
          answerIndex: 1,
          explanation: "This ensures the integrity of user identity and confirms the email address belongs to the user."
        },
        {
          id: "dj-7-16",
          question: "How does Django protect against Cross-Site Request Forgery (CSRF)?",
          options: [
            "By checking for a hidden token in POST forms",
            "By forcing all requests to use HTTPS",
            "By encrypting the database",
            "By blocking JavaScript"
          ],
          answerIndex: 0,
          explanation: "Django's `CsrfViewMiddleware` verifies that the `csrfmiddlewaretoken` included in every POST form matches the one stored in the user's session."
        },
        {
          id: "dj-7-17",
          question: "What is Cross-Site Scripting (XSS)?",
          options: [
            "When someone steals a password",
            "When an attacker injects malicious scripts into web pages viewed by other users. Django prevents this by auto-escaping all output in templates",
            "When someone copies the site code",
            "When a page is too slow"
          ],
          answerIndex: 1,
          explanation: "Django's auto-escaping is a crucial layer of defense, ensuring data like `<script>alert(1)</script>` is displayed as text, not executed as code."
        },
        {
          id: "dj-7-18",
          question: "What is SQL Injection, and how does Django prevent it?",
          options: [
            "Tricking the database into executing malicious commands; prevented by parameterized queries used by the ORM",
            "A bug that crashes the SQL database",
            "Deleting all tables",
            "Using standard SQL everywhere"
          ],
          answerIndex: 0,
          explanation: "Django's ORM automatically uses parameter binding for all queries, meaning user input is always treated as data, never as executable SQL code."
        },
        {
          id: "dj-7-19",
          question: "What is 'Clickjacking'?",
          options: [
            "Double-clicking an icon",
            "Tricking a user into clicking something different from what the user perceives, often through a transparent iframe. Prevented by X-Frame-Options headers",
            "Tracking mouse movements",
            "Clicking too fast"
          ],
          answerIndex: 1,
          explanation: "Django's middleware adds `X-Frame-Options: DENY` (or SAMEORIGIN) to headers, preventing your site from being loaded inside an iframe by a malicious site."
        },
        {
          id: "dj-7-20",
          question: "What is a 'Middleware' in Django?",
          options: [
            "A hardware component",
            "A light, low-level plugin system for globally altering Django’s input or output (e.g., handling authentication or security headers)",
            "A database index",
            "A view component"
          ],
          answerIndex: 1,
          explanation: "Middleware allows you to write code that runs before and after every request, useful for cross-cutting concerns like security."
        }
      ]
    },
    {
      level: 8,
      title: "Level 8: Django REST Framework (DRF) Intermediate",
      description: "Permissions, Filtering, Pagination, and ViewSets.",
      passScore: 16,
      questions: [
        {
          id: "dj-8-1",
          question: "What is a 'ViewSet' in DRF?",
          options: [
            "A collection of HTML views",
            "A class that combines the logic for multiple related views (list, retrieve, create, update, destroy) into a single unified class",
            "A database querying tool",
            "A tool for setting environment variables"
          ],
          answerIndex: 1,
          explanation: "Instead of writing separate `UserList` and `UserDetail` classes, a `UserViewSet` handles all standard REST interactions for the User model."
        },
        {
          id: "dj-8-2",
          question: "What is the primary benefit of using a `ModelViewSet`?",
          options: [
            "It encrypts the database",
            "It provides the complete set of default read and write operations (CRUD) automatically, requiring only a `queryset` and `serializer_class` to be defined",
            "It requires writing raw SQL",
            "It restricts the API to GET requests only"
          ],
          answerIndex: 1,
          explanation: "In two lines of code, a `ModelViewSet` provides a fully functional, production-ready REST API for a database model."
        },
        {
          id: "dj-8-3",
          question: "When using ViewSets, how are the URLs typically generated in `urls.py`?",
          options: [
            "By writing regular expressions manually",
            "By using a DRF `Router` class (like `DefaultRouter`), which automatically generates all standard REST URLs and wires them to the ViewSet methods",
            "By using Django's standard `path()` exclusively",
            "URLs are not needed for ViewSets"
          ],
          answerIndex: 1,
          explanation: "Registering `router.register(r'users', UserViewSet)` instantly creates `/users/` (GET/POST) and `/users/{id}/` (GET/PUT/DELETE) routes."
        },
        {
          id: "dj-8-4",
          question: "In a ViewSet, what method corresponds to an HTTP GET request for a specific ID?",
          options: [
            "list()",
            "retrieve()",
            "fetch()",
            "read()"
          ],
          answerIndex: 1,
          explanation: "`list()` maps to GET `/users/`. `retrieve()` maps to GET `/users/5/`."
        },
        {
          id: "dj-8-5",
          question: "If you want to add a custom endpoint to a ViewSet (e.g., `/users/{id}/change_password/`), what decorator do you use?",
          options: [
            "@custom_route",
            "@action(detail=True, methods=['post'])",
            "@api_view",
            "@endpoint"
          ],
          answerIndex: 1,
          explanation: "The `@action` decorator tells the Router to dynamically add this custom method as an available URL route on the ViewSet."
        },
        {
          id: "dj-8-6",
          question: "What is `TokenAuthentication` in DRF?",
          options: [
            "A method to generate CSRF tokens",
            "A simple token-based HTTP Authentication scheme where each user is assigned a static token saved in the database",
            "A third-party OAuth provider",
            "An encryption protocol"
          ],
          answerIndex: 1,
          explanation: "Clients must pass the token in the header: `Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b`."
        },
        {
          id: "dj-8-7",
          question: "How do you enforce that an API endpoint requires authentication globally across your entire DRF project?",
          options: [
            "By setting `DEFAULT_PERMISSION_CLASSES` to `IsAuthenticated` in the `REST_FRAMEWORK` dictionary in `settings.py`",
            "By wrapping all URLs in a middleware",
            "By requiring passwords in all serializers",
            "By writing a custom database trigger"
          ],
          answerIndex: 0,
          explanation: "Setting this globally is highly secure, as it ensures new endpoints are protected by default. You can override it locally using `permission_classes = [AllowAny]`."
        },
        {
          id: "dj-8-8",
          question: "What is 'Throttling' in DRF?",
          options: [
            "Decreasing the server's CPU speed",
            "Limiting the rate at which clients can make requests to an API (e.g., 100 requests per day) to prevent abuse and DDoS attacks",
            "Compressing JSON responses",
            "Delaying database queries"
          ],
          answerIndex: 1,
          explanation: "DRF allows you to easily apply `AnonRateThrottle` for public users and `UserRateThrottle` for authenticated users."
        },
        {
          id: "dj-8-9",
          question: "What is the purpose of 'Pagination' in a REST API?",
          options: [
            "To print the data on paper",
            "To split a massive dataset (e.g., 1,000,000 rows) into small, manageable chunks (e.g., 20 items per request), saving server memory and bandwidth",
            "To sort data alphabetically",
            "To number the JSON keys"
          ],
          answerIndex: 1,
          explanation: "DRF provides built-in paginators like `PageNumberPagination` (`?page=2`) and `LimitOffsetPagination` (`?limit=10&offset=20`)."
        },
        {
          id: "dj-8-10",
          question: "What is `SerializerMethodField` used for?",
          options: [
            "To generate methods for the model",
            "To add a custom, dynamic, read-only field to the JSON output by writing a function (e.g., `get_custom_field()`) that computes the value on the fly",
            "To execute raw SQL",
            "To hide fields dynamically"
          ],
          answerIndex: 1,
          explanation: "If you want a `days_since_created` field in your API that doesn't actually exist in the database, `SerializerMethodField` computes it during serialization."
        },
        {
          id: "dj-8-11",
          question: "In a DRF Serializer, what does `read_only=True` do to a field?",
          options: [
            "Encrypts the field",
            "Includes the field when sending data OUT to the client, but completely ignores any data the client tries to send IN for that field during validation/saving",
            "Makes the field invisible",
            "Forces the client to provide the field"
          ],
          answerIndex: 1,
          explanation: "This is perfect for an `id` or `created_at` field. The client needs to see it, but should absolutely not be allowed to modify it."
        },
        {
          id: "dj-8-12",
          question: "In a DRF Serializer, what does `write_only=True` do?",
          options: [
            "Requires the client to send the field, but NEVER includes it in the outgoing JSON response (e.g., a 'password' field)",
            "Allows the field to be written to a file",
            "Bypasses validation for the field",
            "Deletes the field from the database"
          ],
          answerIndex: 0,
          explanation: "You need the user to send their password during registration, but returning the password hash back in the JSON response is a security risk."
        },
        {
          id: "dj-8-13",
          question: "How do you perform complex validation across multiple fields in a DRF Serializer?",
          options: [
            "Override the `.validate(self, data)` method and return the data or raise a `serializers.ValidationError`",
            "Use Javascript in the frontend",
            "Write a database trigger",
            "Override the `.save()` method"
          ],
          answerIndex: 0,
          explanation: "`validate()` receives a dictionary of all the fields. You can check `if data['start_date'] > data['end_date']` and raise an error if true."
        },
        {
          id: "dj-8-14",
          question: "What happens if you pass `many=True` when instantiating a Serializer?",
          options: [
            "It validates multiple forms",
            "It tells DRF that it is serializing a list (QuerySet) of multiple objects, rather than a single object instance",
            "It runs the serializer on multiple CPU cores",
            "It multiplies the output by the number of fields"
          ],
          answerIndex: 1,
          explanation: "Without `many=True`, DRF will crash trying to treat your list of objects as a single dictionary."
        },
        {
          id: "dj-8-15",
          question: "What is the 'Browsable API' in DRF?",
          options: [
            "A web browser built into Django",
            "A fully interactive, auto-generated HTML web page that allows developers to visually test GET, POST, and PUT requests against their endpoints without using tools like Postman",
            "A search engine for API documentation",
            "A security firewall"
          ],
          answerIndex: 1,
          explanation: "If you navigate to a DRF endpoint in Chrome, instead of raw JSON, you get a beautiful UI to interact with your API. It is one of DRF's most beloved features."
        },
        {
          id: "dj-8-16",
          question: "Which field determines how Deployments match and manage their Pods?",
          options: [
            "metadata.name",
            "spec.template",
            "spec.selector.matchLabels",
            "spec.replicas"
          ],
          answerIndex: 2,
          explanation: "A Deployment looks for all Pods bearing specific labels (e.g., `app: my-web-server`). If it finds fewer than the replica count, it creates more."
        },
        {
          id: "dj-8-17",
          question: "What is 'HyperlinkedModelSerializer'?",
          options: [
            "A serializer that connects to the internet",
            "A subclass of ModelSerializer that uses hyperlinks (URLs) to represent relationships instead of returning standard primary keys (IDs)",
            "A serializer for HTML text",
            "A serializer that creates web pages"
          ],
          answerIndex: 1,
          explanation: "Instead of `\"author_id\": 5`, it returns `\"author\": \"https://api.site.com/users/5/\"`. This promotes highly discoverable, RESTful API design."
        },
        {
          id: "dj-8-18",
          question: "How do you override the `create()` method in a Serializer?",
          options: [
            "def create(self, validated_data):",
            "def save_new(self, data):",
            "def insert(self, data):",
            "def build(self, validated_data):"
          ],
          answerIndex: 0,
          explanation: "You override `create` to inject custom logic (like hashing a password or saving related models) before the object is committed to the database."
        },
        {
          id: "dj-8-19",
          question: "What does `perform_create(self, serializer)` do in a Generic View or ViewSet?",
          options: [
            "Creates a new database table",
            "It is a hook that allows you to modify the save process from the View level, such as automatically attaching the `request.user` as the author of a Post before saving",
            "It generates mock data",
            "It bypasses all validation"
          ],
          answerIndex: 1,
          explanation: "Example: `def perform_create(self, serializer): serializer.save(author=self.request.user)`. This keeps security logic in the View rather than the Serializer."
        },
        {
          id: "dj-8-20",
          question: "What does DRF's `ContentNegotiation` class do?",
          options: [
            "Negotiates API pricing",
            "Determines which parser (to read the request) and which renderer (to format the response) should be used based on the client's `Accept` and `Content-Type` headers",
            "Encrypts HTTP headers",
            "Resolves database conflicts"
          ],
          answerIndex: 1,
          explanation: "This allows the exact same API endpoint to serve JSON to a mobile app and XML to a legacy enterprise system, automatically."
        }
      ]
    },
    {
      level: 9,
      title: "Level 9: Performance & Caching",
      description: "Database caching, performance tuning, and query optimization.",
      passScore: 16,
      questions: [
        {
          id: "dj-9-1",
          question: "What is the primary purpose of Django's Caching Framework?",
          options: [
            "Deleting old data",
            "Storing the results of expensive operations (like complex DB queries or full HTML rendering) in fast memory (like Redis or Memcached) to serve future requests instantly",
            "Storing user uploaded files",
            "Encrypting passwords"
          ],
          answerIndex: 1,
          explanation: "Caching is the primary way to massively scale a Django application to handle millions of hits per day."
        },
        {
          id: "dj-9-2",
          question: "How do you cache an entire view for 15 minutes?",
          options: [
            "Using the `@cache_page(60 * 15)` decorator on the view function",
            "Adding `CACHE=15` to settings.py",
            "Using the `time.sleep()` function",
            "Saving the HTML to a text file"
          ],
          answerIndex: 0,
          explanation: "The `@cache_page` decorator intercepts the request. If the cache exists, it bypasses the view entirely. If not, it runs the view, caches the result, and returns it."
        },
        {
          id: "dj-9-3",
          question: "Which is generally the fastest cache backend in Django production?",
          options: [
            "File-based cache",
            "Database-based cache",
            "Redis or Memcached (in-memory caching)",
            "Dummy cache"
          ],
          answerIndex: 2,
          explanation: "Redis and Memcached store data in RAM, making retrieval orders of magnitude faster than writing to disk or querying a database."
        },
        {
          id: "dj-9-4",
          question: "What does the `select_for_update()` method do in Django ORM?",
          options: [
            "Locks the database table",
            "Locks the selected rows until the end of the transaction to prevent concurrent modification by other processes",
            "Updates all rows at once",
            "Clears the cache for those rows"
          ],
          answerIndex: 1,
          explanation: "It is crucial for preventing race conditions (e.g., two users trying to book the same seat simultaneously). It must be used inside a transaction."
        },
        {
          id: "dj-9-5",
          question: "How do you perform 'Lazy' operations in Django?",
          options: [
            "By writing code slowly",
            "Django QuerySets are lazy by default; they don't touch the database until you iterate over them or convert to a list/dict",
            "By setting `DELAY=True` in settings",
            "By using `asyncio` for everything"
          ],
          answerIndex: 1,
          explanation: "You can write `q = User.objects.filter(...)` and then add `q = q.exclude(...)`. No SQL is sent to the DB until you print `list(q)`."
        },
        {
          id: "dj-9-6",
          question: "What is `django-debug-toolbar`?",
          options: [
            "A tool for debugging database errors",
            "A configurable set of panels that display debug information about the current request/response, including SQL queries, cache hits, and performance timings",
            "A dashboard for production monitoring",
            "A tool for managing user sessions"
          ],
          answerIndex: 1,
          explanation: "Every Django developer should use this to identify hidden N+1 queries during local development."
        },
        {
          id: "dj-9-7",
          question: "Which database indexing strategy is most important for slow search queries?",
          options: [
            "Adding indexes to columns used in `WHERE`, `ORDER BY`, or `JOIN` clauses (`db_index=True`)",
            "Making every column a primary key",
            "Deleting old data",
            "Caching the entire database"
          ],
          answerIndex: 0,
          explanation: "Without an index, the DB engine must scan every single row (Full Table Scan). An index allows it to jump straight to the correct data."
        },
        {
          id: "dj-9-8",
          question: "Why should you use `iterator()` for processing large QuerySets?",
          options: [
            "It makes the code simpler",
            "It streams the results from the database instead of loading the entire QuerySet into RAM, which is vital when processing thousands of records",
            "It sorts the results",
            "It encrypts the data"
          ],
          answerIndex: 1,
          explanation: "Loading 100,000 objects into memory will crash your server. `iterator()` keeps the memory footprint low and constant."
        },
        {
          id: "dj-9-9",
          question: "What is 'Database Denormalization'?",
          options: [
            "A design error",
            "Adding redundant data or grouping tables to speed up complex read queries, at the expense of potentially slower updates and extra storage space",
            "Removing foreign keys",
            "Creating backup tables"
          ],
          answerIndex: 1,
          explanation: "In high-traffic sites, it is sometimes better to pre-calculate values (like a user's total order count) and store them in a column, rather than joining/counting every time."
        },
        {
          id: "dj-9-10",
          question: "How do you ensure a model field is automatically indexed in the database?",
          options: [
            "Set `index=True` in the field definition",
            "Set `db_index=True` in the field definition",
            "Add a unique key to the table",
            "It happens automatically for all fields"
          ],
          answerIndex: 1,
          explanation: "Adding `db_index=True` will create a standard B-Tree index on that column, speeding up queries that filter by that field."
        },
        {
          id: "dj-9-11",
          question: "What is the primary benefit of the 'Cached QuerySet' approach?",
          options: [
            "It clears the database",
            "It stores the final QuerySet results in cache memory to bypass repetitive heavy database lookups",
            "It makes the DB faster",
            "It simplifies the SQL syntax"
          ],
          answerIndex: 1,
          explanation: "If you have a global navigation menu that needs 'All Categories', caching this prevents millions of redundant hits on your database."
        },
        {
          id: "dj-9-12",
          question: "What does `QuerySet.explain()` do?",
          options: [
            "It adds comments to your code",
            "It prints the SQL execution plan (e.g., `EXPLAIN ANALYZE`) of the QuerySet, helping you identify if the DB is using indexes effectively",
            "It generates documentation",
            "It clears the cache"
          ],
          answerIndex: 1,
          explanation: "If a query is slow, `print(queryset.explain())` will tell you if the database is doing a 'Full Table Scan' vs 'Index Scan'."
        },
        {
          id: "dj-9-13",
          question: "How do you perform a 'Read-only' query in Django to save performance?",
          options: [
            "You cannot",
            "Use `.defer()`",
            "Use `.only()`",
            "QuerySets are already read-only by default until you call .save()"
          ],
          answerIndex: 3,
          explanation: "Simply performing a SELECT query does not lock any rows or create objects for writing. The ORM's main performance work comes from object instantiation."
        },
        {
          id: "dj-9-14",
          question: "What does the `select_related` method accomplish in SQL terms?",
          options: [
            "It performs a LEFT OUTER JOIN",
            "It performs an SQL INNER JOIN, fetching the related object's data in the same query",
            "It performs a UNION",
            "It performs a CROSS JOIN"
          ],
          answerIndex: 1,
          explanation: "It flattens the relationship, retrieving both the parent and child in a single database round-trip."
        },
        {
          id: "dj-9-15",
          question: "What does the `prefetch_related` method accomplish in SQL terms?",
          options: [
            "It performs an SQL INNER JOIN",
            "It executes separate queries for the primary table and the related tables, and joins them in Python memory, which is safer for Many-to-Many",
            "It performs a FULL OUTER JOIN",
            "It sorts the database"
          ],
          answerIndex: 1,
          explanation: "This avoids the 'Cartesian explosion' problem where a simple JOIN could return millions of duplicate rows."
        },
        {
          id: "dj-9-16",
          question: "What is an 'Index Fragmentation'?",
          options: [
            "A file system error",
            "When indexes become disorganized over time due to inserts/updates, requiring a database rebuild (like `REINDEX` in Postgres) to restore speed",
            "Deleting an index",
            "Running out of RAM"
          ],
          answerIndex: 1,
          explanation: "On tables with massive churn, index performance can degrade over time, and a database administrator may need to rebuild indexes."
        },
        {
          id: "dj-9-17",
          question: "How can you debug database queries effectively in Django local development?",
          options: [
            "By checking `django.db.connection.queries` to see the exact SQL executed by the previous code block",
            "By writing raw SQL",
            "By using an external firewall",
            "By clearing the cache"
          ],
          answerIndex: 0,
          explanation: "This provides a list of every single query executed in the current request, making it extremely easy to spot accidental N+1 issues."
        },
        {
          id: "dj-9-18",
          question: "When should you use `defer()` in a QuerySet?",
          options: [
            "To delay the execution of the query",
            "To exclude specific fields (like large Text/Binary fields) from the initial SELECT to save RAM, loading them only when accessed",
            "To force a row lock",
            "To remove duplicates"
          ],
          answerIndex: 1,
          explanation: "If your model has a `biography` field with 5,000 words, use `.defer('biography')` when you only need to show a list of usernames."
        },
        {
          id: "dj-9-19",
          question: "What is a 'Database Connection Pooler' (e.g., PgBouncer)?",
          options: [
            "A pool of water",
            "A middleware that maintains a set of open database connections to avoid the heavy cost of repeatedly creating new TCP connections",
            "A backup tool",
            "A logging server"
          ],
          answerIndex: 1,
          explanation: "Django apps often spawn new connections rapidly. A pooler (especially for Postgres) acts as a gateway that keeps connections open for reuse."
        },
        {
          id: "dj-9-20",
          question: "Why is it usually faster to filter on the database than in Python?",
          options: [
            "Python is slow",
            "Transferring 100,000 rows from the DB to Python just to discard 99,999 of them is an massive waste of network and memory resources compared to letting the DB handle the filtering",
            "The database is encrypted",
            "Python doesn't have an 'if' statement"
          ],
          answerIndex: 1,
          explanation: "Never filter QuerySets using Python (`[u for u in users if u.is_active]`). Always use `.filter(is_active=True)` so only the relevant data enters your app."
        }
      ]
    },
    {
      level: 10,
      title: "Level 10: Advanced Django, Deployment & Security",
      description: "WSGI/ASGI, WebSockets, Docker, and Production Hardening.",
      passScore: 16,
      questions: [
        {
          id: "dj-10-1",
          question: "What is the role of a WSGI server (like Gunicorn) in production?",
          options: [
            "To replace Django",
            "To serve as the application server that sits between a Reverse Proxy (Nginx) and your Python code, managing multiple worker processes to serve concurrent requests",
            "To act as a database connector",
            "To generate HTML"
          ],
          answerIndex: 1,
          explanation: "Django's `runserver` is single-threaded. Gunicorn manages a pool of worker processes, ensuring your app can handle hundreds of concurrent users."
        },
        {
          id: "dj-10-2",
          question: "Why must you use Nginx or Apache in front of Gunicorn?",
          options: [
            "To write Python code",
            "To act as a high-performance Reverse Proxy, handling SSL termination, static file delivery, and buffering slow client connections before passing requests to Gunicorn",
            "To manage the database",
            "To encrypt passwords"
          ],
          answerIndex: 1,
          explanation: "Python is slow at serving static files. Nginx is built in C and can serve images/CSS at lightning speed, while protecting Gunicorn from slow-client attacks."
        },
        {
          id: "dj-10-3",
          question: "What is the purpose of `collectstatic`?",
          options: [
            "To compress images",
            "To aggregate all static assets (JS, CSS, images) from your apps into the directory defined by `STATIC_ROOT`, so the production web server can serve them efficiently",
            "To verify the JS syntax",
            "To move files to the database"
          ],
          answerIndex: 1,
          explanation: "In production, Django is not configured to serve static files (for performance reasons). You bundle them and have Nginx or S3 serve them."
        },
        {
          id: "dj-10-4",
          question: "What is `DEBUG = False` and why is it mandatory in production?",
          options: [
            "It turns off the website",
            "It disables detailed error pages that show source code, local variables, and environment settings, preventing attackers from gaining information about your stack",
            "It makes the site faster",
            "It clears the cache"
          ],
          answerIndex: 1,
          explanation: "Leaving `DEBUG = True` in production is a critical security failure, often allowing anyone to view your DB password in a traceback."
        },
        {
          id: "dj-10-5",
          question: "What does the `SECRET_KEY` do in Django?",
          options: [
            "Encrypts the database",
            "Acts as the salt for session cookies, password reset tokens, and CSRF protection. Leaking it allows attackers to forge cookies and hijack accounts",
            "Used for API authentication",
            "Used to log in to the admin"
          ],
          answerIndex: 1,
          explanation: "If an attacker has your secret key, they can sign their own session cookies, effectively logging in as anyone on your site."
        },
        {
          id: "dj-10-6",
          question: "What is 'Clickjacking' and how does Django prevent it?",
          options: [
            "It's a way to double-click items. Prevented by JavaScript.",
            "It tricks a user into clicking something on your site that they don't see (hidden iframes). Django's `XFrameOptionsMiddleware` sets headers to block framing",
            "It steals passwords. Prevented by hashing.",
            "It is a browser bug."
          ],
          answerIndex: 1,
          explanation: "It blocks your site from being loaded inside an `<iframe>` on a malicious website."
        },
        {
          id: "dj-10-7",
          question: "What is the purpose of `SECURE_SSL_REDIRECT = True`?",
          options: [
            "Forces users to use a secure password",
            "Automatically redirects all incoming HTTP requests to HTTPS, ensuring that no sensitive user data is transmitted over plain text",
            "Encrypts the database",
            "Blocks all visitors"
          ],
          answerIndex: 1,
          explanation: "If you don't do this, sensitive login traffic will be sent in plain text, making users vulnerable to man-in-the-middle attacks."
        },
        {
          id: "dj-10-8",
          question: "What is Django Channels used for?",
          options: [
            "Managing email channels",
            "Adding asynchronous, real-time functionality (like WebSockets, chat apps, and live notifications) to Django by replacing the WSGI standard with ASGI",
            "Caching views",
            "Creating database migrations"
          ],
          answerIndex: 1,
          explanation: "WebSockets (a persistent, two-way connection) are the core use case for Channels, which standard Django cannot do."
        },
        {
          id: "dj-10-9",
          question: "What is a 'Channel Layer' in Django Channels?",
          options: [
            "The CSS layout system",
            "A communication system (typically using Redis) that allows different instances of your Django application to talk to each other and send messages to connected clients",
            "A database index",
            "A security firewall"
          ],
          answerIndex: 1,
          explanation: "It allows a user on Server A to send a chat message to a user connected to Server B."
        },
        {
          id: "dj-10-10",
          question: "What is the 'Twelve-Factor App' methodology?",
          options: [
            "A fitness program for developers",
            "A set of twelve architectural best practices for building scalable, resilient, and cloud-native Software-as-a-Service (SaaS) applications",
            "A security compliance standard",
            "A pricing model for AWS"
          ],
          answerIndex: 1,
          explanation: "Created by Heroku, it provides guidelines on codebase tracking, dependencies, stateless processes, and configuration management."
        },
        {
          id: "dj-10-11",
          question: "According to the Twelve-Factor App, how should 'Configuration' be handled?",
          options: [
            "Hardcoded in the application",
            "Stored in the environment (as environment variables), completely separated from the code",
            "Stored in a local text file",
            "Saved in the database"
          ],
          answerIndex: 1,
          explanation: "This allows the exact same code artifact to be deployed to Staging and Production simply by changing the environment variables."
        },
        {
          id: "dj-10-12",
          question: "What does it mean for a process to be 'Stateless' in cloud-native architecture?",
          options: [
            "It has no country of origin",
            "The application does not store any persistent data or session state on the local server's disk or memory; all state is stored in a backing service like Redis or a database",
            "The application does not use variables",
            "The application is turned off"
          ],
          answerIndex: 1,
          explanation: "Stateless applications can be scaled horizontally easily. Any request can go to any server without losing session data."
        },
        {
          id: "dj-10-13",
          question: "What is 'Dockerizing' a Django model application?",
          options: [
            "Running it on a container",
            "Packaging the Python code, dependencies (pip), and OS configuration into a standardized image to ensure it runs identically on Dev, Staging, and Production",
            "Encrypting the code",
            "Reducing the database size"
          ],
          answerIndex: 1,
          explanation: "Docker solves 'it works on my machine' by containerizing the environment, including the OS, Python, and dependencies."
        },
        {
          id: "dj-10-14",
          question: "What is an 'Environment Variable'?",
          options: [
            "A variable that changes based on weather",
            "A way to pass configuration data into your app from the host OS, keeping sensitive secrets out of the version-controlled source code",
            "A database table name",
            "A CSS class"
          ],
          answerIndex: 1,
          explanation: "Using `os.environ.get('DB_PASSWORD')` is the standard way to retrieve sensitive data injected by cloud hosting services."
        },
        {
          id: "dj-10-15",
          question: "What does `manage.py check --deploy` accomplish?",
          options: [
            "It deploys the code",
            "It runs a suite of automated checks that inspect your `settings.py` for common security and deployment misconfigurations (like leaving DEBUG=True)",
            "It checks the database connection",
            "It restarts the production server"
          ],
          answerIndex: 1,
          explanation: "Always run this command before going live to ensure you haven't forgotten critical security headers or settings."
        },
        {
          id: "dj-10-16",
          question: "What is 'WhiteNoise' commonly used for in Django?",
          options: [
            "Generating random data",
            "A package that allows your Python web app to serve its own static files efficiently in production, heavily used on PaaS platforms like Heroku",
            "A tool for audio processing",
            "A security firewall"
          ],
          answerIndex: 1,
          explanation: "On Heroku, you don't have access to Nginx. WhiteNoise integrates directly into Django's middleware to serve static files rapidly."
        },
        {
          id: "dj-10-17",
          question: "Why do we use a `.gitignore` file?",
          options: [
            "To ignore security warnings",
            "To tell Git which files/folders (like `.env`, `venv`, `__pycache__`, or database backups) should not be committed to the code repository",
            "To hide the database",
            "To block access to the admin"
          ],
          answerIndex: 1,
          explanation: "Committing your `.env` file or database to Git is a massive security risk and a version control nightmare."
        },
        {
          id: "dj-10-18",
          question: "What is a 'Database Migration' for?",
          options: [
            "Moving data to a new server",
            "Propagating changes in your models (like adding a field or deleting a table) to the actual database schema in an orderly, versioned manner",
            "Refreshing the cache",
            "Exporting to CSV"
          ],
          answerIndex: 1,
          explanation: "Migrations allow your database schema to evolve along with your code, ensuring everyone on your team has the same database structure."
        },
        {
          id: "dj-10-19",
          question: "What is 'SQL Injection'?",
          options: [
            "Adding new features to SQL",
            "A vulnerability where an attacker manipulates application input to execute malicious SQL code. Django ORM prevents this via parameterization",
            "Deleting tables using SQL",
            "A speed optimization for SQL"
          ],
          answerIndex: 1,
          explanation: "Because Django ORM parameterizes all queries, you are protected as long as you avoid using raw SQL with string formatting."
        },
        {
          id: "dj-10-20",
          question: "What is 'Unit Testing' in Django?",
          options: [
            "Testing for database bugs",
            "Using the `unittest` framework or `pytest` to isolate and test small, individual pieces of logic (like a custom model method) to ensure they work as expected",
            "Testing the server speed",
            "Checking the UI"
          ],
          answerIndex: 1,
          explanation: "Testing is essential for stability. By verifying small components individually, you prevent regressions whenever you add new features."
        }
      ]
    }

  ]
};
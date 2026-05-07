export type CourseTopic = {
  id: string;
  title: string;
  category: string;
  description: string;
  keyTerms: string[];
  examFocus: string[];
  examples: string[];
  portfolioArtifact: string;
};

export const courseTopics: CourseTopic[] = [
  {
    id: "digital-literacy",
    title: "Digital Literacy",
    category: "Foundations",
    description:
      "The ability to use digital tools, systems, and information effectively and responsibly.",
    keyTerms: [
      "digital skills",
      "information literacy",
      "online safety",
      "productivity tools",
    ],
    examFocus: [
      "Understand why digital literacy matters for AI use",
      "Identify safe and responsible technology behaviors",
      "Connect digital skills to AI-powered workflows",
    ],
    examples: [
      "Using cloud storage correctly",
      "Verifying information from online sources",
      "Using AI tools responsibly",
    ],
    portfolioArtifact: "Digital literacy checklist for AI learners",
  },
  {
    id: "practical-digital-skills",
    title: "Practical Functional Digital Skills",
    category: "Foundations",
    description:
      "Hands-on skills for using devices, software, files, and digital workflows that AI tools build on.",
    keyTerms: [
      "productivity software",
      "file management",
      "cloud basics",
      "security hygiene",
    ],
    examFocus: [
      "Relate practical digital fluency to building and deploying AI prototypes",
      "Spot setup errors that break data or model workflows",
    ],
    examples: [
      "Organizing datasets before upload",
      "Using notebooks and environments safely",
    ],
    portfolioArtifact: "Personal digital skills audit for AI projects",
  },
  {
    id: "digital-collaboration",
    title: "Digital Collaboration",
    category: "Foundations",
    description:
      "Working with others through digital channels, versioned assets, and shared AI-related documentation.",
    keyTerms: [
      "shared drives",
      "version control concepts",
      "async communication",
      "roles and permissions",
    ],
    examFocus: [
      "Describe how teams share data and models responsibly",
      "Identify collaboration risks (leaks, stale files, unclear ownership)",
    ],
    examples: [
      "Splitting labeling work across teammates",
      "Sharing experiment results without exposing PII",
    ],
    portfolioArtifact: "Team collaboration norms for AI mini-projects",
  },
  {
    id: "information-curation",
    title: "Curating Information",
    category: "Foundations",
    description:
      "Selecting, organizing, and evaluating information sources so AI systems train on trustworthy inputs.",
    keyTerms: [
      "source quality",
      "metadata",
      "bias in sources",
      "curation workflow",
    ],
    examFocus: [
      "Explain why curation affects model quality and safety",
      "Compare strong vs weak sources for training data",
    ],
    examples: [
      "Building a labeled text corpus from vetted articles",
      "Filtering noisy scraped web data",
    ],
    portfolioArtifact: "Information curation rubric for a dataset",
  },
  {
    id: "iot-data-sources",
    title: "Data Sources and the Internet of Things",
    category: "Foundations",
    description:
      "How connected sensors and devices produce streams of data that feed analytics and ML systems.",
    keyTerms: [
      "IoT",
      "sensor data",
      "edge vs cloud",
      "telemetry",
    ],
    examFocus: [
      "Describe how IoT data is created and collected",
      "Connect IoT data pipelines to ML use cases",
    ],
    examples: [
      "Smart building energy sensors",
      "Wearables generating health-related signals",
    ],
    portfolioArtifact: "IoT data sketch: source → storage → model",
  },
  {
    id: "ai-history",
    title: "AI History",
    category: "Foundations",
    description: "Major milestones in the development of artificial intelligence.",
    keyTerms: [
      "Turing Test",
      "expert systems",
      "machine learning",
      "deep learning",
      "generative AI",
    ],
    examFocus: [
      "Know major AI milestones",
      "Understand the shift from rule-based AI to machine learning",
      "Recognize why modern AI improved with data and compute",
    ],
    examples: [
      "Expert systems in medicine",
      "Deep learning for image recognition",
      "Generative AI chatbots",
    ],
    portfolioArtifact: "Timeline of major AI milestones",
  },
  {
    id: "ai-terminology",
    title: "AI Terminology",
    category: "Foundations",
    description:
      "Core vocabulary used to understand AI systems and machine learning.",
    keyTerms: [
      "model",
      "algorithm",
      "dataset",
      "training",
      "prediction",
      "label",
      "feature",
    ],
    examFocus: [
      "Define basic AI terms",
      "Use the terms correctly in examples",
      "Distinguish model, algorithm, and data",
    ],
    examples: [
      "A spam detector is a model",
      "Email text can be input data",
      "Spam or not spam can be a label",
    ],
    portfolioArtifact: "AI vocabulary one-page glossary",
  },
  {
    id: "ai-project-cycle",
    title: "AI Project Cycle",
    category: "AI Workflow",
    description:
      "The step-by-step process used to build and evaluate AI systems.",
    keyTerms: [
      "problem definition",
      "data collection",
      "data preparation",
      "modeling",
      "evaluation",
      "deployment",
    ],
    examFocus: [
      "Know each stage of the AI project cycle",
      "Identify which stage a task belongs to",
      "Explain why evaluation matters before deployment",
    ],
    examples: [
      "Defining a spam detection problem",
      "Collecting labeled emails",
      "Testing accuracy before release",
    ],
    portfolioArtifact: "AI project lifecycle workflow diagram",
  },
  {
    id: "problem-definition",
    title: "Problem Definition",
    category: "AI Workflow",
    description: "Clearly deciding what problem the AI system should solve.",
    keyTerms: [
      "goal",
      "scope",
      "success metric",
      "constraints",
      "stakeholders",
    ],
    examFocus: [
      "Explain why unclear problems create bad AI systems",
      "Identify good vs bad AI problem statements",
      "Connect problem definition to evaluation",
    ],
    examples: [
      "Predict tenant payment risk",
      "Classify emails as spam or not spam",
      "Detect plant disease from images",
    ],
    portfolioArtifact: "AI problem definition worksheet",
  },
  {
    id: "data-collection",
    title: "Data Collection",
    category: "AI Workflow",
    description:
      "Gathering the information an AI system needs to learn or make predictions.",
    keyTerms: ["dataset", "source", "sample", "label", "data quality"],
    examFocus: [
      "Know why data quality matters",
      "Identify examples of useful data",
      "Understand data privacy concerns",
    ],
    examples: [
      "Collecting customer transaction records",
      "Collecting labeled cat and dog images",
      "Collecting chatbot conversation examples",
    ],
    portfolioArtifact: "Data collection plan template",
  },
  {
    id: "data-sources-and-provenance",
    title: "Data Sources and Their Production",
    category: "AI Workflow",
    description:
      "Where datasets come from, how they are generated, and what provenance means for trust and compliance.",
    keyTerms: [
      "provenance",
      "synthetic data",
      "surveys",
      "logs",
      "licensing",
    ],
    examFocus: [
      "Identify realistic data sources for a stated problem",
      "Explain how production context shapes data bias and gaps",
    ],
    examples: [
      "Transaction logs vs manual labels",
      "Public datasets vs proprietary company data",
    ],
    portfolioArtifact: "Data provenance one-pager for a project",
  },
  {
    id: "data-visualization",
    title: "Data Visualization",
    category: "AI Workflow",
    description:
      "Visual methods to explore distributions, errors, and patterns before and after modeling.",
    keyTerms: [
      "histogram",
      "scatter plot",
      "class balance chart",
      "confusion matrix heatmap",
    ],
    examFocus: [
      "Use visualization to catch data and model issues early",
      "Match chart types to diagnostic questions",
    ],
    examples: [
      "Plotting label imbalance",
      "Visualizing false positives by segment",
    ],
    portfolioArtifact: "EDA visualization checklist",
  },
  {
    id: "data-transformation",
    title: "Data Transformation",
    category: "AI Workflow",
    description:
      "Feature encoding, scaling, reshaping, and other transforms that prepare raw fields for learning algorithms.",
    keyTerms: [
      "encoding",
      "scaling",
      "tokenization",
      "feature engineering",
    ],
    examFocus: [
      "Explain why transforms link raw data to model math",
      "Recognize bad transforms (leakage, wrong splits)",
    ],
    examples: [
      "One-hot encoding categories",
      "Normalizing numeric sensor readings",
    ],
    portfolioArtifact: "Transformation log for one dataset",
  },
  {
    id: "data-preparation",
    title: "Data Preparation",
    category: "AI Workflow",
    description:
      "Cleaning, organizing, labeling, and transforming data before modeling.",
    keyTerms: [
      "cleaning",
      "labeling",
      "normalization",
      "missing values",
      "outliers",
    ],
    examFocus: [
      "Explain why raw data is usually not ready for AI",
      "Identify common data cleaning tasks",
      "Understand how bad data affects model results",
    ],
    examples: [
      "Removing duplicate rows",
      "Fixing missing values",
      "Labeling images for classification",
    ],
    portfolioArtifact: "Data preparation checklist",
  },
  {
    id: "modeling",
    title: "Modeling",
    category: "AI Workflow",
    description: "Training or configuring an AI model to learn patterns from data.",
    keyTerms: ["training", "algorithm", "features", "parameters", "model"],
    examFocus: [
      "Understand what training means",
      "Explain how models learn from examples",
      "Connect modeling to prediction",
    ],
    examples: [
      "Training a classifier to detect spam",
      "Using Teachable Machine to classify images",
      "Training a model on labeled data",
    ],
    portfolioArtifact: "Model training explainer",
  },
  {
    id: "evaluation",
    title: "Evaluation",
    category: "AI Workflow",
    description:
      "Testing how well an AI model performs before using it in the real world.",
    keyTerms: [
      "accuracy",
      "precision",
      "recall",
      "test data",
      "confusion matrix",
    ],
    examFocus: [
      "Know why models must be evaluated",
      "Understand basic metrics",
      "Recognize that high accuracy can still hide problems",
    ],
    examples: [
      "Testing a spam model on unseen emails",
      "Checking false positives and false negatives",
      "Comparing predicted labels to true labels",
    ],
    portfolioArtifact: "Model evaluation metric cheat sheet",
  },
  {
    id: "deployment",
    title: "Deployment",
    category: "AI Workflow",
    description: "Putting an AI model into real use after testing.",
    keyTerms: ["release", "monitoring", "feedback", "maintenance", "drift"],
    examFocus: [
      "Understand that AI systems need monitoring",
      "Know why deployment is not the final end",
      "Connect deployment to real-world risk",
    ],
    examples: [
      "Adding a trained chatbot to a website",
      "Using a fraud model in a payment system",
      "Monitoring model mistakes after launch",
    ],
    portfolioArtifact: "AI deployment risk checklist",
  },
  {
    id: "supervised-learning",
    title: "Supervised Learning",
    category: "Machine Learning",
    description:
      "A machine learning method where a model learns from labeled examples.",
    keyTerms: [
      "labeled data",
      "input",
      "output",
      "classification",
      "regression",
    ],
    examFocus: [
      "Define supervised learning",
      "Recognize labeled data examples",
      "Compare it to unsupervised learning",
    ],
    examples: ["Spam detection", "Credit risk prediction", "Image classification"],
    portfolioArtifact: "Supervised learning case study",
  },
  {
    id: "unsupervised-learning",
    title: "Unsupervised Learning",
    category: "Machine Learning",
    description:
      "A machine learning method where a model finds patterns in unlabeled data.",
    keyTerms: [
      "unlabeled data",
      "clustering",
      "patterns",
      "segments",
      "similarity",
    ],
    examFocus: [
      "Define unsupervised learning",
      "Know clustering as a common example",
      "Compare it to supervised learning",
    ],
    examples: [
      "Customer segmentation",
      "Grouping similar documents",
      "Finding patterns in shopping behavior",
    ],
    portfolioArtifact: "Supervised vs unsupervised comparison chart",
  },
  {
    id: "no-code-ai-tools",
    title: "No-Code AI Tools",
    category: "Tools",
    description:
      "Tools that let users build or test AI systems without heavy programming.",
    keyTerms: [
      "Teachable Machine",
      "Orange Data Mining",
      "CVAT",
      "chatbot builder",
      "low-code",
    ],
    examFocus: [
      "Know what no-code AI tools are used for",
      "Match tools to tasks",
      "Understand their limitations",
    ],
    examples: [
      "Training an image model in Teachable Machine",
      "Exploring datasets in Orange",
      "Labeling image data in CVAT",
    ],
    portfolioArtifact: "No-code AI lab report template",
  },
  {
    id: "classification",
    title: "Classification",
    category: "Machine Learning",
    description: "A task where an AI model assigns an item to a category.",
    keyTerms: [
      "class",
      "label",
      "classifier",
      "binary classification",
      "multi-class classification",
    ],
    examFocus: [
      "Define classification",
      "Identify classification problems",
      "Understand labels and classes",
    ],
    examples: ["Spam vs not spam", "Cat vs dog", "Low, medium, or high risk"],
    portfolioArtifact: "Classification examples mini-guide",
  },
  {
    id: "model-training",
    title: "Model Training and Prediction",
    category: "Machine Learning",
    description:
      "Training teaches a model patterns; prediction uses those patterns on new inputs.",
    keyTerms: ["training data", "test data", "prediction", "features", "target"],
    examFocus: [
      "Explain training vs prediction",
      "Identify features and target labels",
      "Understand why models need examples",
    ],
    examples: [
      "Training on old emails, predicting new emails",
      "Training on past payments, predicting payment risk",
      "Training on labeled images, predicting new image labels",
    ],
    portfolioArtifact: "Training vs prediction visual explainer",
  },
  {
    id: "linear-classifiers",
    title: "Linear Classifiers",
    category: "Machine Learning",
    description:
      "Models that separate classes with linear decision boundaries; foundation for many ML courses.",
    keyTerms: [
      "decision boundary",
      "weights",
      "logistic regression",
      "perceptron",
    ],
    examFocus: [
      "Explain when linear separability holds or fails",
      "Contrast linear classifiers with k-NN and trees",
    ],
    examples: [
      "Spam filter with linear model",
      "2D toy dataset with line separator",
    ],
    portfolioArtifact: "Linear classifier lab notes (Python)",
  },
  {
    id: "support-vector-machines",
    title: "Support Vector Machines (SVM)",
    category: "Machine Learning",
    description:
      "Margin-maximizing classifiers; kernel SVMs handle non-linear boundaries.",
    keyTerms: ["margin", "support vectors", "kernel trick", "C parameter"],
    examFocus: [
      "State the intuition of maximum margin",
      "Describe role of kernels at a high level",
    ],
    examples: [
      "Text classification with linear SVM",
      "Non-linear boundary via RBF kernel (concept)",
    ],
    portfolioArtifact: "SVM hyperparameter memo",
  },
  {
    id: "quadratic-classifiers",
    title: "Quadratic Classifiers",
    category: "Machine Learning",
    description:
      "Classifiers that can learn quadratic decision surfaces; linked to Gaussian discriminant views of data.",
    keyTerms: [
      "quadratic boundary",
      "Mahalanobis distance",
      "generative vs discriminative (intro)",
    ],
    examFocus: [
      "Contrast quadratic vs linear decision surfaces",
      "Identify when quadratic models are appropriate (conceptual)",
    ],
    examples: [
      "Toy 2D dataset needing curved boundary",
      "When covariance structure matters between classes",
    ],
    portfolioArtifact: "Compare linear vs quadratic boundary sketch",
  },
  {
    id: "k-nearest-neighbor",
    title: "k-Nearest Neighbor (k-NN)",
    category: "Machine Learning",
    description:
      "Instance-based classification using similarity to labeled neighbors in feature space.",
    keyTerms: ["k", "distance metric", "Curse of dimensionality", "vote"],
    examFocus: [
      "Explain prediction by neighborhood voting",
      "Discuss scaling and choice of k",
    ],
    examples: [
      "Classifying iris-style numeric features",
      "Showing sensitivity to feature scale",
    ],
    portfolioArtifact: "k-NN experiment write-up (Python)",
  },
  {
    id: "decision-trees-ml",
    title: "Decision Trees",
    category: "Machine Learning",
    description:
      "Recursive rule-based partitions of feature space; interpretable baselines and ensemble building blocks.",
    keyTerms: ["split", "impurity", "depth", "overfitting", "random forest (mention)"],
    examFocus: [
      "Read a simple decision tree narrative",
      "Explain overfitting with deep trees",
    ],
    examples: [
      "Loan approval rules",
      "Feature importance from shallow tree",
    ],
    portfolioArtifact: "Decision tree interpretation notes",
  },
  {
    id: "neural-networks",
    title: "Neural Networks",
    category: "Machine Learning",
    description:
      "Composable layers of units that learn representations; basis for deep learning across modalities.",
    keyTerms: [
      "layer",
      "activation",
      "backpropagation",
      "deep network",
    ],
    examFocus: [
      "Describe how neural nets differ from classical linear models",
      "Identify common application areas (vision, language)",
    ],
    examples: [
      "Image classifier CNN sketch",
      "Simple feedforward net for tabular data",
    ],
    portfolioArtifact: "Neural net concept map",
  },
  {
    id: "python-classification-labs",
    title: "Python: Classification Models Lab",
    category: "Machine Learning",
    description:
      "Hands-on reproduction of linear classifiers, SVM, k-NN, and neural nets in Python per course outcomes.",
    keyTerms: ["scikit-learn", "NumPy", "notebook", "train/test split"],
    examFocus: [
      "Train and evaluate each model on a course-style dataset",
      "Compare metrics across models fairly",
    ],
    examples: [
      "Notebook training linear SVM vs k-NN",
      "Small neural net with a standard library",
    ],
    portfolioArtifact: "Python lab: four model comparison report",
  },
  {
    id: "enterprise-ai-readiness",
    title: "Enterprise AI and Implementation Readiness",
    category: "Enterprise AI",
    description:
      "Scalability constraints, engineering tradeoffs, and data pipelines as organizations adopt ML.",
    keyTerms: [
      "scalability",
      "latency",
      "cost",
      "MLOps",
      "batch vs online inference",
    ],
    examFocus: [
      "Research how enterprise constraints change model choices",
      "Outline a basic data pipeline from ingest to serving",
    ],
    examples: [
      "Retail demand forecasting at scale",
      "Fraud scoring with SLAs",
    ],
    portfolioArtifact: "Enterprise readiness brief with tradeoff table",
  },
  {
    id: "ai-ethics",
    title: "AI Ethics, Bias, Privacy, and Safety",
    category: "Responsible AI",
    description:
      "Responsible AI focuses on building systems that are fair, safe, private, and accountable.",
    keyTerms: [
      "bias",
      "fairness",
      "privacy",
      "transparency",
      "accountability",
      "safety",
    ],
    examFocus: [
      "Identify ethical risks in AI systems",
      "Explain bias and privacy concerns",
      "Suggest responsible AI safeguards",
    ],
    examples: [
      "Biased hiring algorithms",
      "Privacy risks from personal data",
      "Unsafe chatbot advice",
    ],
    portfolioArtifact: "Responsible AI risk analysis checklist",
  },
  {
    id: "algorithmic-privacy-fairness",
    title: "Algorithmic Privacy and Fairness",
    category: "Responsible AI",
    description:
      "Vocabulary and mechanisms where automated systems impact privacy and equitable treatment.",
    keyTerms: [
      "algorithmic privacy",
      "algorithmic fairness",
      "protected attributes",
      "disclosure risk",
    ],
    examFocus: [
      "Define algorithmic privacy and fairness precisely",
      "Give examples of harm and mitigation patterns",
    ],
    examples: [
      "Re-identification from aggregates",
      "Disparate impact in credit or hiring models",
    ],
    portfolioArtifact: "Fairness & privacy glossary with cases",
  },
  {
    id: "computing-ethics-lifecycle",
    title: "Computing Ethics: Development, Deployment, and Administration",
    category: "Responsible AI",
    description:
      "Ethical issues across building, shipping, and operating AI systems in organizations.",
    keyTerms: [
      "development ethics",
      "operational risk",
      "governance",
      "incident response",
    ],
    examFocus: [
      "Identify ethics issues at development vs implementation vs administration",
      "Propose checks appropriate to each stage",
    ],
    examples: [
      "Consent and labeling practices during build",
      "Monitoring and rollback after deploy",
    ],
    portfolioArtifact: "Lifecycle ethics review worksheet",
  },
  {
    id: "computer-vision-overview",
    title: "Computer Vision",
    category: "Computer Vision",
    description:
      "Teaching machines to interpret images and video for perception tasks.",
    keyTerms: ["pixel", "convolution", "dataset", "annotation"],
    examFocus: [
      "Explain core CV tasks at syllabus level",
      "Connect data needs to vision model behavior",
    ],
    examples: [
      "Street-scene understanding",
      "Medical imaging assistance",
    ],
    portfolioArtifact: "CV task taxonomy poster",
  },
  {
    id: "facial-recognition",
    title: "Facial Recognition",
    category: "Computer Vision",
    description:
      "Detecting and matching faces; tightly coupled to privacy, consent, and misuse risks.",
    keyTerms: ["embedding", "verification", "identification", "liveness"],
    examFocus: [
      "Describe how face recognition pipelines work at a high level",
      "Discuss ethics and regulation touchpoints",
    ],
    examples: [
      "Device unlock",
      "Large-scale public surveillance concerns",
    ],
    portfolioArtifact: "Facial recognition risks briefing",
  },
  {
    id: "image-segmentation",
    title: "Image Segmentation",
    category: "Computer Vision",
    description:
      "Labeling each pixel or region so models separate objects, boundaries, or tissue types.",
    keyTerms: ["mask", "semantic segmentation", "instance segmentation"],
    examFocus: [
      "Contrast segmentation with classification",
      "Name use cases where masks are required",
    ],
    examples: [
      "Medical organ outlines",
      "Self-driving drivable area maps",
    ],
    portfolioArtifact: "Segmentation use case summary",
  },
  {
    id: "object-and-motion-detection",
    title: "Object and Motion Detection",
    category: "Computer Vision",
    description:
      "Localizing objects in frames and tracking motion across time for video understanding.",
    keyTerms: ["bounding box", "tracker", "optical flow", "temporal continuity"],
    examFocus: [
      "Explain object detection outputs",
      "Relate motion cues to applications like surveillance or sports analytics",
    ],
    examples: [
      "Pedestrian detection",
      "Factory safety zone monitoring",
    ],
    portfolioArtifact: "Detection vs tracking explainer",
  },
  {
    id: "object-classification-vision",
    title: "Object Classification in Vision",
    category: "Computer Vision",
    description:
      "Assigning category labels to detected objects or whole images within vision pipelines.",
    keyTerms: ["top-k accuracy", "fine-grained classes", "multi-label"],
    examFocus: [
      "Distinguish whole-image classification vs detected-object classification",
      "Link to generic classification competency",
    ],
    examples: [
      "Species identification",
      "Defect vs OK on a manufacturing line",
    ],
    portfolioArtifact: "Vision classification mini case study",
  },
  {
    id: "machine-translation",
    title: "Machine Translation",
    category: "Natural Language Processing",
    description:
      "Automatic translation between languages using statistical and neural sequence models.",
    keyTerms: ["parallel corpus", "BLEU", "encoder-decoder", "transformer"],
    examFocus: [
      "Describe why translation needs alignment and context",
      "Identify failure modes (idioms, low-resource languages)",
    ],
    examples: [
      "Browser translate features",
      "Subtitles generated automatically",
    ],
    portfolioArtifact: "Translation quality critique",
  },
  {
    id: "sentiment-analysis",
    title: "Sentiment Analysis",
    category: "Natural Language Processing",
    description:
      "Inferring opinion polarity or emotion from text for monitoring and decision support.",
    keyTerms: [
      "polarity",
      "aspect-based sentiment",
      "lexicon vs learned",
    ],
    examFocus: [
      "Explain baselines vs deep models for sentiment",
      "Spot domain shift problems",
    ],
    examples: [
      "Product review dashboards",
      "Brand mention trackers",
    ],
    portfolioArtifact: "Sentiment model failure analysis",
  },
  {
    id: "deep-learning-nlp",
    title: "Deep Learning for NLP",
    category: "Natural Language Processing",
    description:
      "Neural representations and large models powering modern language understanding and generation.",
    keyTerms: [
      "token",
      "embedding",
      "transformer",
      "pre-training",
    ],
    examFocus: [
      "Explain why DL changed NLP capabilities",
      "Connect embeddings to downstream tasks",
    ],
    examples: [
      "Semantic search",
      "Summarization assistants",
    ],
    portfolioArtifact: "NLP deep learning concept sheet",
  },
  {
    id: "speech-recognition-and-synthesis",
    title: "Speech Recognition and Synthesis",
    category: "Natural Language Processing",
    description:
      "ASR converts audio to text; TTS generates natural speech from text for interfaces and accessibility.",
    keyTerms: ["ASR", "TTS", "phoneme", "waveform", "voice cloning risk"],
    examFocus: [
      "Describe pipeline stages from audio to text and back",
      "Note accessibility benefits and misuse risks",
    ],
    examples: [
      "Voice assistants",
      "Dictation software",
    ],
    portfolioArtifact: "Speech tech societal impact notes",
  },
  {
    id: "python-chatbots",
    title: "Python Chatbots",
    category: "Natural Language Processing",
    description:
      "Building simple conversational agents in Python as required hands-on skill.",
    keyTerms: ["intent", "pattern matching", "API", "state", "guardrails"],
    examFocus: [
      "Reproduce a minimal chatbot flow in Python",
      "Separate retrieval/rule logic from unsafe open-ended generation (concept)",
    ],
    examples: [
      "FAQ bot from structured intents",
      "Lab bot calling a small local model API",
    ],
    portfolioArtifact: "Python chatbot lab submission",
  },
  {
    id: "robotics-fundamentals",
    title: "Robotics Fundamentals",
    category: "Robotics & Autonomy",
    description:
      "Physical systems that sense, plan, and act in the world; marriage of hardware and AI.",
    keyTerms: ["actuator", "kinematics", "control loop", "embodiment"],
    examFocus: [
      "Define robotics components and feedback loops",
      "Relate software stacks to physical constraints",
    ],
    examples: [
      "Warehouse mobile robots",
      "Robot arms in assembly",
    ],
    portfolioArtifact: "Robot system block diagram",
  },
  {
    id: "robot-sensing-manipulation",
    title: "Robotic Sensing and Manipulation",
    category: "Robotics & Autonomy",
    description:
      "Touch, force, vision, and proprioception for grasping, assembly, and delicate tasks.",
    keyTerms: ["gripper", "force torque", "tactile", "calibration"],
    examFocus: [
      "Explain why manipulation needs rich sensing",
      "Compare open-loop vs closed-loop control",
    ],
    examples: [
      "Bin picking",
      "Surgical assist systems (high-level)",
    ],
    portfolioArtifact: "Sensing vs manipulation tradeoffs one-pager",
  },
  {
    id: "human-robot-interaction",
    title: "Human-Robot Interaction (HRI)",
    category: "Robotics & Autonomy",
    description:
      "Designing safe, legible, and useful collaboration between people and robots.",
    keyTerms: ["shared workspace", "trust", "explainability", "safety standards"],
    examFocus: [
      "Identify UX and safety considerations in HRI",
      "Discuss autonomy levels with humans in the loop",
    ],
    examples: [
      "Cobots on factory lines",
      "Assistive home robots",
    ],
    portfolioArtifact: "HRI scenario walkthrough",
  },
  {
    id: "navigation-path-planning",
    title: "Navigation and Path Planning",
    category: "Robotics & Autonomy",
    description:
      "Mapping, localization, and planning feasible routes under dynamics and obstacles.",
    keyTerms: ["SLAM", "graph search", "cost map", "collision checking"],
    examFocus: [
      "Outline sense-plan-act loop for mobile robots",
      "Contrast global vs local planning",
    ],
    examples: [
      "Indoor delivery robots",
      "Drone routing (concept)",
    ],
    portfolioArtifact: "Path planning analogy diagram",
  },
  {
    id: "reinforcement-learning",
    title: "Reinforcement Learning",
    category: "Robotics & Autonomy",
    description:
      "Agents improving behavior through rewards; used in games, robotics, and control.",
    keyTerms: [
      "policy",
      "reward",
      "exploration",
      "Markov decision process",
    ],
    examFocus: [
      "Define RL loop (state, action, reward)",
      "Contrast RL with supervised learning",
    ],
    examples: [
      "Game-playing agents",
      "Robot skill learning (high-level)",
    ],
    portfolioArtifact: "RL vs supervised learning comparison",
  },
  {
    id: "autonomous-vehicles",
    title: "Autonomous Vehicles",
    category: "Robotics & Autonomy",
    description:
      "Stacks for perception, prediction, and planning in road environments; societal impacts of deployment.",
    keyTerms: ["ADAS", "LiDAR", "sensor fusion", "regulation"],
    examFocus: [
      "Explain major subsystems of an autonomy stack",
      "Discuss technology and societal impacts",
    ],
    examples: [
      "Highway assist vs full self-driving (levels)",
      "Insurance and liability questions",
    ],
    portfolioArtifact: "Autonomous vehicle impact essay",
  }

];

export function getTopicById(id: string): CourseTopic | undefined {
  return courseTopics.find((t) => t.id === id);
}

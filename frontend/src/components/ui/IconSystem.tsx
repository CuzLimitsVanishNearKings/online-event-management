import React from 'react'
import { 
  // Navigation & Actions
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Home,
  Settings,
  LogOut,
  
  // User & Authentication
  User,
  UserPlus,
  Users,
  Heart,
  Star,
  Bookmark,
  
  // Event Related
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Plus,
  Edit,
  Trash2,
  Share2,
  Filter,
  
  // Location & Place
  Globe,
  Navigation,
  
  // Money & Pricing
  DollarSign,
  CreditCard,
  TrendingUp,
  
  // Media & Content
  Image,
  Video,
  FileText,
  Download,
  Upload,
  
  // Communication
  Mail,
  Phone,
  MessageSquare,
  Bell,
  
  // Status & Indicators
  Check,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  
  // UI Elements
  Eye,
  EyeOff,
  SlidersHorizontal,
  Grid,
  List,
  LayoutGrid,
  MoreHorizontal,
  MoreVertical,
  
  // Transportation
  Car,
  Train,
  Plane,
  Map,
  
  // Entertainment
  Music,
  Mic,
  Camera,
  Palette,
  
  // Business
  Briefcase,
  Building,
  Award,
  Target,
  
  // Health & Wellness
  Activity,
  HeartPulse,
  Smile,
  
  // Technology
  Smartphone,
  Laptop,
  Wifi,
  
  // Food & Drink
  Utensils,
  Coffee,
  Wine,
  
  // Shopping
  ShoppingCart,
  ShoppingBag,
  Package as PackageIcon,
  
  // Time & Date
  Clock3,
  Timer,
  
  // Miscellaneous
  Zap,
  Sparkles,
  Flame,
  TrendingUp as Trending,
  ExternalLink,
  Copy,
  Link,
  Unlink,
  Lock,
  Unlock,
  Shield,
  HelpCircle,
  ChevronFirst,
  ChevronLast,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  
  // Arrows (additional)
  ArrowUpRight,
  ArrowDownLeft,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowLeftCircle,
  ArrowRightCircle,
  
  // Shapes
  Circle,
  Square as SquareIcon,
  Triangle,
  Hexagon,
  
  // Weather
  Sun,
  Cloud,
  CloudRain,
  Wind,
  
  // File types
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileText as FileTextIcon,
  FileCode,
  FileArchive,
  
  // Device specific
  Monitor,
  Tablet,
  Smartphone as SmartphoneIcon,
  
  // Security
  Key,
  Fingerprint,
  
  // Analytics
  BarChart,
  BarChart2,
  LineChart,
  PieChart,
  Activity as ActivityIcon,
  
  // Editor
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List as ListIcon,
  ListOrdered,
  Indent,
  Outdent,
  
  // Development
  Code,
  Terminal,
  GitBranch,
  Package as PackageDev,
  
  // Design
  Palette as PaletteIcon,
  Brush,
  Move,
  Maximize2,
  Minimize2,
  
  // Media controls
  Rewind,
  FastForward,
  Repeat,
  Repeat1,
  Shuffle,
  
  // Additional icons for comprehensive coverage
  Archive,
  Inbox,
  Send,
  Paperclip,
  Link2,
  Unlink2,
  Flag,
  FlagTriangleRight,
  FlagTriangleLeft,
  Hash,
  AtSign,
  Percent,
  DollarSign as DollarSignIcon,
  PoundSterling,
  IndianRupee,
  Bitcoin,
  CreditCard as CreditCardIcon,
  Banknote,
  PiggyBank,
  Wallet,
  
  // Time related
  Hourglass,
  Timer as TimerIcon,
  
  // Location enhanced
  MapPin as MapPinIcon,
  Map as MapIcon,
  Compass,
  Route,
  
  // Communication enhanced
  MessageSquare as MessageSquareIcon,
  MessageCircle,
  MessageCirclePlus,
  MessageSquarePlus,
  
  // Social enhanced
  ThumbsUp,
  ThumbsDown,
  Share as ShareIcon,
  Share2 as Share2Icon,
  
  // Status enhanced
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  X as XIcon,
  XCircle as XCircleIcon,
  AlertCircle as AlertCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  Info as InfoIcon,
  
  // Loading states
  Loader2,
  RefreshCw,
  RotateCw,
  
  // Navigation enhanced
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  
  // Additional UI
  MoreHorizontal as MoreHorizontalIcon,
  MoreVertical as MoreVerticalIcon,
  Ellipsis,
  
  // Misc
  Sparkles as SparklesIcon,
  Zap as ZapIcon,
  Flame as FlameIcon,
} from 'lucide-react'

// Icon sizes for consistent usage
export const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10',
  '3xl': 'w-12 h-12',
}

// Icon component with consistent sizing and styling
interface IconProps {
  icon: React.ComponentType<any>
  size?: keyof typeof iconSizes
  className?: string
  color?: string
}

const Icon = ({ icon: IconComponent, size = 'md', className = '', color }: IconProps) => {
  return (
    <IconComponent 
      className={`${iconSizes[size]} ${className}`}
      style={{ color }}
    />
  )
}

// Export all icons with consistent naming
export {
  // Navigation & Actions
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Home,
  Settings,
  LogOut,
  
  // User & Authentication
  User,
  UserPlus,
  Users,
  Heart,
  Star,
  Bookmark,
  
  // Event Related
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Plus,
  Edit,
  Trash2,
  Share2,
  Filter,
  
  // Location & Place
  Globe,
  Navigation,
  
  // Money & Pricing
  DollarSign,
  CreditCard,
  TrendingUp,
  
  // Media & Content
  Image,
  Video,
  FileText,
  Download,
  Upload,
  
  // Communication
  Mail,
  Phone,
  MessageSquare,
  Bell,
  
  // Status & Indicators
  Check,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  
  // UI Elements
  Eye,
  EyeOff,
  SlidersHorizontal,
  Grid,
  List,
  LayoutGrid,
  MoreHorizontal,
  MoreVertical,
  
  // Transportation
  Car,
  Train,
  Plane,
  Map,
  
  // Entertainment
  Music,
  Mic,
  Camera,
  Palette,
  
  // Business
  Briefcase,
  Building,
  Award,
  Target,
  
  // Health & Wellness
  Activity,
  HeartPulse,
  Smile,
  
  // Technology
  Smartphone,
  Laptop,
  Wifi,
  
  // Food & Drink
  Utensils,
  Coffee,
  Wine,
  
  // Shopping
  ShoppingCart,
  ShoppingBag,
  PackageIcon,
  
  // Time & Date
  Clock3,
  Timer,
  
  // Miscellaneous
  Zap,
  Sparkles,
  Flame,
  Trending,
  ExternalLink,
  Copy,
  Link,
  Unlink,
  Lock,
  Unlock,
  Shield,
  HelpCircle,
  ChevronFirst,
  ChevronLast,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  
  // Additional exports
  Icon,
}

export default Icon

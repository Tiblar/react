export const WEB_URL = "https://formerlychucks.net";
export const API_URL = "https://formerlychucks.net/api/v2";
export const SUPPORT_URL = "https://formerlychucks.net/support";
export const STATUS_URL = "https://formerlychucks.net/support";
export const SUCCESSFUL_BOOST_URL_PAYPAL = "https://formerlychucks.net/support/boost/success/paypal"
export const SUCCESSFUL_BOOST_URL_CREDIT_CARD = "https://formerlychucks.net/support/boost/success/cc"
export const SOCKET_GATEWAY = "ws://localhost:3031";

export const BOTTOM_LOAD_HEIGHT = 400;

export const MAX_MOBILE_WIDTH = 1100;

export const BOOST_PRODUCT_ID = "";

export const PAYMENT_METHOD_CREDIT_CARD_STRIPE = "STRIPE";
export const PAYMENT_METHOD_PAYPAL = "PAYPAL";
export const PAYMENT_METHOD_CRYPTOCURRENCY = "CRYPTOCURRENCY";
export const PAYMENT_METHOD_BITCOIN = "BITCOIN";
export const PAYMENT_METHOD_MONERO = "MONERO";
export const PAYMENT_METHOD_LITECOIN = "LITECOIN";
export const PAYMENT_METHOD_BITCOIN_CASH = "BITCOIN_CASH";
export const PAYMENT_METHOD_TETHER = "TETHER";
export const PAYMENT_METHOD_USD_COIN = "USD_COIN";
export const PAYMENT_METHOD_DOGE = "DOGE";
export const PAYMENT_METHOD_CRYPTO_LIST = [
    PAYMENT_METHOD_BITCOIN,
    PAYMENT_METHOD_MONERO,
    PAYMENT_METHOD_LITECOIN,
    PAYMENT_METHOD_BITCOIN_CASH,
    PAYMENT_METHOD_TETHER,
    PAYMENT_METHOD_USD_COIN,
    PAYMENT_METHOD_DOGE,
];

export const PAYMENT_FREQUENCY_ANNUALLY = "ANNUALLY";
export const PAYMENT_FREQUENCY_MONTHLY = "MONTHLY";

export const INVOICE_EVENT_RECURRING_START = "INVOICE_EVENT_START";
export const INVOICE_EVENT_RECURRING_UPGRADE = "INVOICE_EVENT_UPGRADE";
export const INVOICE_EVENT_RECURRING_DOWNGRADE = "INVOICE_EVENT_DOWNGRADE";
export const INVOICE_EVENT_RECURRING = "INVOICE_EVENT_RECURRING";

// One time payment
export const INVOICE_EVENT_ONCE = "INVOICE_EVENT_ONCE";

export const INVOICE_STATUS_PAID = "INVOICE_STATUS_PAID";
export const INVOICE_STATUS_DECLINED = "INVOICE_STATUS_DECLINED";
export const INVOICE_STATUS_PENDING = "INVOICE_STATUS_PENDING";
export const INVOICE_STATUS_DELETED = "INVOICE_STATUS_DELETED";
export const INVOICE_STATUS_REFUNDED = "INVOICE_STATUS_REFUNDED";
export const INVOICE_STATUS_FRAUD = "INVOICE_STATUS_FRAUD";
export const INVOICE_STATUS_OTHER = "INVOICE_STATUS_OTHER";
export const INVOICE_STATUS_EXPIRED = "INVOICE_STATUS_EXPIRED";

export const PAYPAL_GATEWAY = "https://www.paypal.com/cgi-bin/webscr";
export const PAYPAL_CANCEL_URL = "https://www.paypal.com/myaccount/autopay/";
export const PAYPAL_FORMERLY_CHUCKS_IPN = API_URL + "/market/ipn/paypal";

export const STRIPE_PK = "";

export const POST_TYPES = ["TEXT", "IMAGE", "VIDEO", "AUDIO", "PDF", "MAGNET", "FILE", "POLL", 'STREAM'];
export const POST_TEXT = "POST_TEXT";
export const POST_IMAGE = "POST_IMAGE";
export const POST_VIDEO = "POST_VIDEO";
export const POST_AUDIO = "POST_AUDIO";
export const POST_PDF = "POST_PDF";
export const POST_MAGNET = "POST_MAGNET";
export const POST_FILE = "POST_FILE";
export const POST_POLL = "POST_POLL";
export const POST_STREAM = "POST_STREAM";

export const POST_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp"];
export const POST_VIDEO_EXTENSIONS = ["mp4", "webm", "mov"];
export const POST_AUDIO_EXTENSIONS = ["mp3", "ogg", "flac"];
export const POST_PDF_EXTENSIONS = ["pdf"];
export const POST_FILE_EXTENSIONS = ["zip", "tar.gz"];

// Size in megabytes
export const POST_IMAGE_MAX_SIZE = 80;
export const POST_VIDEO_MAX_SIZE = 100;
export const POST_AUDIO_MAX_SIZE = 100;
export const POST_PDF_MAX_SIZE = 100;
export const POST_FILE_MAX_SIZE = 100;

export const POST_BOOST_IMAGE_MAX_SIZE = 80;
export const POST_BOOST_VIDEO_MAX_SIZE = 100;
export const POST_BOOST_AUDIO_MAX_SIZE = 100;
export const POST_BOOST_PDF_MAX_SIZE = 100;
export const POST_BOOST_FILE_MAX_SIZE = 100;

export const MAX_IMAGE_FILES = 10;
export const MAX_DEFAULT_FILES = 1;

export const TITLE_LENGTH = 70;
export const BODY_LENGTH = 32000;

export const MAX_TAGS = 20;
export const MAX_TAG_LENGTH = 24;

export const MAX_USERNAME_LENGTH = 16;
export const MIN_USERNAME_LENGTH = 3;

export const MAX_BIOGRAPHY_LENGTH = 600;
export const MAX_LOCATION_LENGTH = 30;

export const PAST_DAY = 1;
export const PAST_WEEK = 2;
export const PAST_MONTH = 3;
export const PAST_6_MONTHS = 4;
export const PAST_YEAR = 5;
export const ALL_TIME = 6;

export const PERIOD_SORT = {
    1: "Past Day",
    2: "Past Week",
    3: "Past Month",
    4: "Past 6 Months",
    5: "Past Year",
    6: "All Time"
};

export const POST_OFFSET = 10;
export const POST_LIMIT = 10;

export const FOLLOW_OFFSET = 10;
export const FOLLOW_LIMIT = 10;

export const ERROR_BLOCKED_BY = "You have been blocked by this user.";
export const ERROR_VIEW_FOLLOW = "You must follow to see this user.";
export const ERROR_VIEW_LOGIN = "You must login to see this user.";
export const ERROR_RATE_LIMIT = "You have been rate limited.";
export const ERROR_BANNED = "This user has been banned.";

export const VIEW_EVERYONE = 0;
export const VIEW_FORMERLY_CHUCKS = 1;
export const VIEW_FOLLOWERS = 2;

export const TWO_FACTOR_EMAIL = "TWO_FACTOR_EMAIL";

export const NOTIFICATION_FAVORITE = "TYPE_FAVORITE";
export const NOTIFICATION_REBLOG = "TYPE_REBLOG";
export const NOTIFICATION_FOLLOW = "TYPE_FOLLOW";
export const NOTIFICATION_UNFOLLOW = "TYPE_UNFOLLOW";
export const NOTIFICATION_FOLLOW_REQUEST = "TYPE_FOLLOW_REQUEST";
export const NOTIFICATION_MENTION = "TYPE_MENTION";
export const NOTIFICATION_REPLY_MENTION = "TYPE_REPLY_MENTION";
export const NOTIFICATION_REPLY = "TYPE_REPLY";

export const LIGHT_THEME = "light";
export const DARK_THEME = "dark";
export const OUTRUN_THEME = "outrun";
export const CYBERPUNK_THEME = "cyberpunk";
export const COZY_THEME = "cozy";
export const SKELETON_THEME = "skeleton";
export const NEWSPAPER_THEME = "newspaper";
export const CLOVER_THEME = "clover";

export const CONNECTION_DISCORD_URL = "https://discord.com/api/oauth2/authorize?client_id=575039585352941568&redirect_uri=https%3A%2F%2Ftiblar.com%2Fconnect%2Fdiscord&response_type=code&scope=identify"
export const CONNECTION_DISCORD_CODE_ERROR = "You entered an invalid code.";

export type SocialPlatformId = 
  | 'facebook' 
  | 'instagram' 
  | 'whatsapp' 
  | 'threads' 
  | 'tiktok' 
  | 'youtube' 
  | 'twitter';

export type SocialActionType = 
  | 'post' 
  | 'story' 
  | 'status'
  | 'message' 
  | 'search' 
  | 'play' 
  | 'reels' 
  | 'shorts' 
  | 'like' 
  | 'share' 
  | 'call' 
  | 'trending';

export interface SocialActionItem {
  id: string;
  platform: SocialPlatformId;
  actionType: SocialActionType;
  title: string;
  banglaTitle: string;
  description: string;
  iconName: string;
  color: string;
  bgGradient: string;
  badge?: string;
}

export interface SocialVoiceCommandResult {
  matched: boolean;
  platform?: SocialPlatformId;
  actionType?: SocialActionType;
  targetQuery?: string;
  speechReply: string;
  deepLink?: string;
  payload?: any;
}

export interface SocialHistoryItem {
  id: string;
  platform: SocialPlatformId;
  action: string;
  text?: string;
  timestamp: string;
  status: 'completed' | 'sent' | 'opened';
}

const HISTORY_KEY = 'sh_ai_social_history';

class SocialMediaService {
  private history: SocialHistoryItem[] = [];

  constructor() {
    this.loadHistory();
  }

  private loadHistory() {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        this.history = JSON.parse(stored);
      } else {
        this.history = [
          {
            id: 'hist-1',
            platform: 'facebook',
            action: 'Status Post',
            text: 'শুভ সকাল বন্ধুরা! ৪২০ ফ্রাইডে এআই দিয়ে ভয়েসে পোস্ট করলাম ✨',
            timestamp: 'আজ সকাল ১০:১৫',
            status: 'completed'
          },
          {
            id: 'hist-2',
            platform: 'whatsapp',
            action: 'Quick Message',
            text: 'Hi bro, call me when free.',
            timestamp: 'আজ দুপুর ১২:৩০',
            status: 'sent'
          },
          {
            id: 'hist-3',
            platform: 'youtube',
            action: 'Video Search & Play',
            text: 'Bangla Lo-Fi Chill Beats 2026',
            timestamp: 'আজ বিকাল ৩:৪৫',
            status: 'completed'
          }
        ];
      }
    } catch {
      this.history = [];
    }
  }

  private saveHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history.slice(0, 50)));
    } catch {}
  }

  public getHistory(): SocialHistoryItem[] {
    return [...this.history];
  }

  public addHistoryItem(item: Omit<SocialHistoryItem, 'id' | 'timestamp'>) {
    const newItem: SocialHistoryItem = {
      ...item,
      id: `hist-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.history.unshift(newItem);
    this.saveHistory();
  }

  public clearHistory() {
    this.history = [];
    this.saveHistory();
  }

  /**
   * Generates clean web intents and deep links for platforms
   */
  public generateIntent(platform: SocialPlatformId, action: SocialActionType, payload?: {
    text?: string;
    url?: string;
    phone?: string;
    query?: string;
  }): { webUrl: string; appScheme?: string } {
    const text = encodeURIComponent(payload?.text || '');
    const url = encodeURIComponent(payload?.url || window.location.href);
    const query = encodeURIComponent(payload?.query || '');
    const phone = (payload?.phone || '').replace(/[^0-9]/g, '');

    switch (platform) {
      case 'facebook':
        if (action === 'story') {
          return {
            webUrl: 'https://www.facebook.com/stories/create',
            appScheme: 'fb://story_composer'
          };
        }
        if (action === 'message') {
          return {
            webUrl: 'https://www.messenger.com',
            appScheme: 'fb-messenger://'
          };
        }
        return {
          webUrl: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
          appScheme: `fb://facewebmodal/f?href=https://www.facebook.com`
        };

      case 'whatsapp':
        if (phone) {
          return {
            webUrl: `https://api.whatsapp.com/send?phone=${phone}&text=${text}`,
            appScheme: `whatsapp://send?phone=${phone}&text=${text}`
          };
        }
        return {
          webUrl: `https://api.whatsapp.com/send?text=${text}`,
          appScheme: `whatsapp://send?text=${text}`
        };

      case 'youtube':
        if (action === 'shorts') {
          return {
            webUrl: 'https://www.youtube.com/shorts',
            appScheme: 'vnd.youtube://'
          };
        }
        if (query) {
          return {
            webUrl: `https://www.youtube.com/results?search_query=${query}`,
            appScheme: `vnd.youtube://results?search_query=${query}`
          };
        }
        return {
          webUrl: 'https://www.youtube.com',
          appScheme: 'vnd.youtube://'
        };

      case 'instagram':
        if (action === 'reels') {
          return {
            webUrl: 'https://www.instagram.com/reels/',
            appScheme: 'instagram://reels'
          };
        }
        if (action === 'story') {
          return {
            webUrl: 'https://www.instagram.com/create/story',
            appScheme: 'instagram://story-camera'
          };
        }
        if (action === 'message') {
          return {
            webUrl: 'https://www.instagram.com/direct/inbox/',
            appScheme: 'instagram://direct'
          };
        }
        return {
          webUrl: 'https://www.instagram.com/',
          appScheme: 'instagram://main'
        };

      case 'threads':
        return {
          webUrl: `https://www.threads.net/intent/post?text=${text}`,
          appScheme: `threads://post?text=${text}`
        };

      case 'tiktok':
        if (query) {
          return {
            webUrl: `https://www.tiktok.com/tag/${query}`,
            appScheme: `snssdk1233://tag?tag_name=${query}`
          };
        }
        return {
          webUrl: 'https://www.tiktok.com/explore',
          appScheme: 'snssdk1233://explore'
        };

      case 'twitter':
        return {
          webUrl: `https://twitter.com/intent/tweet?text=${text}`,
          appScheme: `twitter://post?message=${text}`
        };

      default:
        return { webUrl: 'https://google.com' };
    }
  }

  /**
   * Executes intent directly in safe popout window and logs action
   */
  public executeAction(platform: SocialPlatformId, action: SocialActionType, payload?: {
    text?: string;
    url?: string;
    phone?: string;
    query?: string;
  }): { success: boolean; webUrl: string } {
    const { webUrl } = this.generateIntent(platform, action, payload);

    try {
      window.open(webUrl, '_blank', 'noopener,noreferrer');
      this.addHistoryItem({
        platform,
        action: `${action.toUpperCase()} Action`,
        text: payload?.text || payload?.query || payload?.phone || 'Executed',
        status: 'opened'
      });
      return { success: true, webUrl };
    } catch {
      return { success: false, webUrl };
    }
  }

  /**
   * Natural Bangla & English Voice Command Parser for all Social Media
   */
  public processVoiceCommand(input: string, lang: string = 'bn-BD'): SocialVoiceCommandResult {
    const text = input.trim();
    const lower = text.toLowerCase();

    // 1. FACEBOOK
    if (lower.includes('facebook') || text.includes('ফেসবুক')) {
      if (lower.includes('post') || text.includes('পোস্ট') || text.includes('স্ট্যাটাস')) {
        const cleaned = text
          .replace(/(?:ফেসবুকে|ফেসবুক|facebook|fb)\s*(?:পোস্ট\s*করো|পোস্ট|স্ট্যাটাস|post|status)\s*:?/i, '')
          .trim();
        const postText = cleaned || 'Hello Facebook from SH AI Voice Assistant!';
        const intent = this.generateIntent('facebook', 'post', { text: postText });

        this.addHistoryItem({
          platform: 'facebook',
          action: 'Voice Post',
          text: postText,
          status: 'completed'
        });

        return {
          matched: true,
          platform: 'facebook',
          actionType: 'post',
          targetQuery: postText,
          speechReply: `অবশ্যই বস! ফেসবুকে পোস্ট রেডি করেছি: "${postText}"। শেয়ার উইন্ডো ওপেন হচ্ছে।`,
          deepLink: intent.webUrl,
          payload: { text: postText }
        };
      }

      if (lower.includes('story') || text.includes('স্টোরি')) {
        const intent = this.generateIntent('facebook', 'story');
        return {
          matched: true,
          platform: 'facebook',
          actionType: 'story',
          speechReply: 'ফেসবুক স্টোরি ক্রিয়েটর চালু করছি বস!',
          deepLink: intent.webUrl
        };
      }

      const intent = this.generateIntent('facebook', 'post');
      return {
        matched: true,
        platform: 'facebook',
        actionType: 'post',
        speechReply: 'ফেসবুক ওপেন করছি বস!',
        deepLink: intent.webUrl
      };
    }

    // 2. WHATSAPP
    if (lower.includes('whatsapp') || text.includes('হোয়াটসঅ্যাপ') || text.includes('মেসেজ')) {
      let msgText = text
        .replace(/(?:হোয়াটসঅ্যাপে|হোয়াটসঅ্যাপ|whatsapp)\s*(?:মেসেজ\s*পাঠাও|মেসেজ|send\s*message\s*to|send)\s*:?/i, '')
        .trim();
      
      const phoneMatch = text.match(/(?:\+?88)?01[3-9]\d{8}/);
      const phone = phoneMatch ? phoneMatch[0] : '';

      if (phone) {
        msgText = msgText.replace(phone, '').trim();
      }

      const finalMsg = msgText || 'Hello from SH AI Voice Assistant!';
      const intent = this.generateIntent('whatsapp', 'message', { phone, text: finalMsg });

      this.addHistoryItem({
        platform: 'whatsapp',
        action: 'Voice Message',
        text: phone ? `To ${phone}: ${finalMsg}` : finalMsg,
        status: 'sent'
      });

      return {
        matched: true,
        platform: 'whatsapp',
        actionType: 'message',
        targetQuery: finalMsg,
        speechReply: phone 
          ? `হোয়াটসঅ্যাপে ${phone} নম্বরে বার্তা পাঠানো হচ্ছে: "${finalMsg}"`
          : `হোয়াটসঅ্যাপ মেসেজ রেডি বস: "${finalMsg}"`,
        deepLink: intent.webUrl,
        payload: { phone, text: finalMsg }
      };
    }

    // 3. YOUTUBE (Full access)
    if (lower.includes('youtube') || text.includes('ইউটিউব') || lower.includes('গান') || lower.includes('ভিডিও')) {
      if (lower.includes('shorts') || text.includes('শর্টস')) {
        const intent = this.generateIntent('youtube', 'shorts');
        return {
          matched: true,
          platform: 'youtube',
          actionType: 'shorts',
          speechReply: 'ইউটিউব শর্টস ওপেন করছি বস!',
          deepLink: intent.webUrl
        };
      }

      let query = text
        .replace(/(?:ইউটিউবে|ইউটিউব|youtube)\s*(?:চালাও|প্লে\s*করো|সার্চ\s*করো|দেখাও|play|search)\s*:?/i, '')
        .replace(/(?:গান\s*চালাও|গান|ভিডিও)/i, '')
        .trim();

      const finalQuery = query || 'Top trending music 2026';
      const intent = this.generateIntent('youtube', 'search', { query: finalQuery });

      this.addHistoryItem({
        platform: 'youtube',
        action: 'Voice Play/Search',
        text: finalQuery,
        status: 'completed'
      });

      return {
        matched: true,
        platform: 'youtube',
        actionType: 'play',
        targetQuery: finalQuery,
        speechReply: `ইউটিউবে "${finalQuery}" সার্চ করে চালু করছি বস!`,
        deepLink: intent.webUrl,
        payload: { query: finalQuery }
      };
    }

    // 4. INSTAGRAM
    if (lower.includes('instagram') || text.includes('ইন্সটাগ্রাম') || lower.includes('insta')) {
      if (lower.includes('reels') || text.includes('রিলস') || text.includes('রিল')) {
        const intent = this.generateIntent('instagram', 'reels');
        return {
          matched: true,
          platform: 'instagram',
          actionType: 'reels',
          speechReply: 'ইন্সটাগ্রাম ট্রেন্ডিং রিলস চালু করছি বস!',
          deepLink: intent.webUrl
        };
      }

      if (lower.includes('story') || text.includes('স্টোরি')) {
        const intent = this.generateIntent('instagram', 'story');
        return {
          matched: true,
          platform: 'instagram',
          actionType: 'story',
          speechReply: 'ইন্সটাগ্রাম স্টোরি ক্যামেরা চালু করছি!',
          deepLink: intent.webUrl
        };
      }

      const intent = this.generateIntent('instagram', 'post');
      return {
        matched: true,
        platform: 'instagram',
        actionType: 'post',
        speechReply: 'ইন্সটাগ্রাম ফিড ও পোস্ট রেডি বস!',
        deepLink: intent.webUrl
      };
    }

    // 5. TIKTOK
    if (lower.includes('tiktok') || text.includes('টিকটক')) {
      let tag = text
        .replace(/(?:টিকটকে|টিকটক|tiktok)\s*(?:ট্রেন্ডিং|ট্রেন্ড|দেখাও|সার্চ|ভিডিও)\s*:?/i, '')
        .trim();
      const finalTag = tag || 'trending';
      const intent = this.generateIntent('tiktok', 'trending', { query: finalTag });

      this.addHistoryItem({
        platform: 'tiktok',
        action: 'Trending Explore',
        text: `#${finalTag}`,
        status: 'completed'
      });

      return {
        matched: true,
        platform: 'tiktok',
        actionType: 'trending',
        targetQuery: finalTag,
        speechReply: `টিকটকে ট্রেন্ডিং #${finalTag} ভিডিও এক্সপ্লোর করছি বস!`,
        deepLink: intent.webUrl
      };
    }

    // 6. THREADS
    if (lower.includes('threads') || text.includes('থ্রেডস') || text.includes('থ্রেড')) {
      const threadText = text
        .replace(/(?:থ্রেডসে|থ্রেডস|threads)\s*(?:পোস্ট\s*করো|পোস্ট|post)\s*:?/i, '')
        .trim() || 'Excited to share via SH AI Assistant!';
      const intent = this.generateIntent('threads', 'post', { text: threadText });

      this.addHistoryItem({
        platform: 'threads',
        action: 'Thread Post',
        text: threadText,
        status: 'completed'
      });

      return {
        matched: true,
        platform: 'threads',
        actionType: 'post',
        speechReply: `থ্রেডসে পোস্ট রেডি বস: "${threadText}"`,
        deepLink: intent.webUrl,
        payload: { text: threadText }
      };
    }

    // 7. TWITTER / X
    if (lower.includes('twitter') || text.includes('টুইটার') || lower.includes('tweet') || text.includes('টুইট')) {
      const tweetText = text
        .replace(/(?:টুইটারে|টুইটার|twitter|tweet|টুইট)\s*(?:পোস্ট\s*করো|পোস্ট|করো|post)\s*:?/i, '')
        .trim() || 'Posting live with SH AI Assistant 🚀';
      const intent = this.generateIntent('twitter', 'post', { text: tweetText });

      this.addHistoryItem({
        platform: 'twitter',
        action: 'Tweet Intent',
        text: tweetText,
        status: 'completed'
      });

      return {
        matched: true,
        platform: 'twitter',
        actionType: 'post',
        speechReply: `এক্স (টুইটার)-এ পোস্ট রেডি বস: "${tweetText}"`,
        deepLink: intent.webUrl,
        payload: { text: tweetText }
      };
    }

    return {
      matched: false,
      speechReply: ''
    };
  }
}

export const socialMediaService = new SocialMediaService();

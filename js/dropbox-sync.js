
import { Dropbox } from 'dropbox';

const DROPBOX_APP_KEY = 'sl.u.AFYGiTZAeV_8zlKsalIrgnKhiqa3kzmvlhZ_Q_w-8L-nF6XzbRgoHf0sPkua7OIL8RFfOUm8uXqHR--Pe_UXzqBCaHXVk_mWAgNXZ3fSV-9PRZHKWtrj5lWpjXhAD_7V8ObZ9wjUswE8I7YkZI8n2ZuGIoah_bgz8OGN-0J0cRektDsUL-EJLVsM0VVQbmEU0fQeU24wsCikB0mLfq1P9u982Wm58fB_7HNdF7XIOZvn-jjTsnTl-mC2h18wRyrpAg6meOZk2xU7bSaeby0rpAlhegipChW2yqH7wZVbzQD7dyVKT7HiOxkz8Mn_tXxZjWRn1viP9w6sPJIqEUn5CDx01IZ86gMmnAuXRPuDXduaNEuPvXBL4xVbgx7qG8lkbDq0SpPndRs_HLyYRdB38A2zUGd62pMijWwLYqo-dCyMe7Zop9ch48NG-Y-QA_LfsCd11TTK2Ym_iuqREckN5SUvAIrxFXP5FMEyLMovHvUDvDB0E04LpGQzPaWXh4CgoVIkqvlKMXl9wesPDgasSyo8FIJ0-ac0GubZR_M5jzMNTFfvdgmA8ePZ79B6VqMBj9KKVsT39opY4uuPhyXEi_GkFpSEb_vJ3BMGJahB-qmymJy0aZEJYXzsJ1lWFQIr1Csp_icIFEnWC54aoaDqHgvVy6PhuS6V8n8Buj-5zJGeemOT9hdbTnOmkQcdyUX9GaCqA8ffVrCTVL2FDqRusNvse-1odafWOyyE4k67x-892lPLay8JQtrk5_FtnzR7pm3CsFV2O_fdcgjI4VSX3_IJS4lm4GACmOoaewWjWPcd-K4x1Vb3bEOw_B7VNvtOqM-BeHsRFI3A8vQESeg5z0Nj23JHsspXeXgp5wiX9e8SErHX4e8e3exp8gsX4Iz1ETK2ERdT948b1_FjTVdCZWL3fQESa1NU_tqWmRysF8ZYP5_JhjXOGjSA9aE5tEZXhd01oWu-vQCPFWoPv6P65qpVOMmcNBr0r5EdTxm1L_tsnaK-Wx9PctBplmW2Iv_AyPgrggahujeeaVUbmXZ43Zx8r43JxEoimmPQJdsaVhDc8iCVmeR0EsdWg1_HTwKsTAgQgpzhfzyr0EThdKSVVqlTREb-sNreo_x72HahkGhoK1xIbGFl-IV5jXUb-ocsusvAY1rO47RS08BBtJ4M9l9NEhuIPDag_gWb9ITDl1AlUob8AzZ6r1T7P0OHoL_S-oYp--VzJgJNhodfiF94rb7R8XbTtv9fQAnDdfdR6nriMhxUcYRa2YVuGOitCJcaW0loEGAAJFYvVWp-SiqqLKbC';
const BOOKMARKS_FILE_PATH = './data/data.json';

export default function useDropboxSync() {
  const [dropbox, setDropbox] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [lastSynced, setLastSynced] = useState(null);

  // Initialize Dropbox client
  useEffect(() => {
    const dbx = new Dropbox({ clientId: DROPBOX_APP_KEY });
    setDropbox(dbx);
  }, []);

  // Sync local bookmarks to Dropbox
  const syncToDropbox = async (bookmarks) => {
    if (!dropbox) return;
    
    try {
      setSyncStatus('syncing');
      
      // Convert bookmarks to JSON string
      const bookmarksJson = JSON.stringify(bookmarks);
      const data = new Blob([bookmarksJson], { type: 'application/json' });

      // Upload to Dropbox
      await dropbox.filesUpload({
        path: BOOKMARKS_FILE_PATH,
        contents: data,
        mode: { '.tag': 'overwrite' }
      });

      setLastSynced(new Date());
      setSyncStatus('synced');
    } catch (error) {
      setSyncStatus('error');
      console.error('Sync failed:', error);
    }
  };

  // Load bookmarks from Dropbox
  const loadFromDropbox = async () => {
    if (!dropbox) return null;

    try {
      setSyncStatus('loading');
      
      // Download file from Dropbox
      const response = await dropbox.filesDownload({ path: BOOKMARKS_FILE_PATH });
      
      // Read file content
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const bookmarks = JSON.parse(reader.result);
          setSyncStatus('loaded');
          resolve(bookmarks);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsText(response.fileBlob);
      });
    } catch (error) {
      setSyncStatus('error');
      console.error('Load failed:', error);
      return null;
    }
  };

  // Handle conflicts
  const resolveConflicts = async (localBookmarks, remoteBookmarks) => {
    // Merge based on timestamp
    const merged = {};
    
    [...Object.entries(localBookmarks), ...Object.entries(remoteBookmarks)]
      .forEach(([id, bookmark]) => {
        if (!merged[id] || new Date(bookmark.updatedAt) > new Date(merged[id].updatedAt)) {
          merged[id] = bookmark;
        }
      });

    return merged;
  };

  return {
    syncStatus,
    lastSynced,
    syncToDropbox,
    loadFromDropbox,
    resolveConflicts
  };
}
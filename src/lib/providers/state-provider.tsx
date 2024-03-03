'use client';
import React, {
    Dispatch,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
} from 'react';

import {File,Folder} from '@/lib/supabase/supabase.types'
import { usePathname } from 'next/navigation';
import { getFilesFromFolderId } from '../supabase/queries';

export type appFoldersType = Folder & { files: File[] | [] };

interface AppState {
    folders: appFoldersType[] | [];
}

type Action =
  | {
      type: 'SET_FOLDERS';
      payload: { folders: appFoldersType[] | []};
    }
  | {
      type: 'ADD_FOLDER';
      payload: appFoldersType ;
    }
    | {
        type: 'UPDATE_FOLDER';
        payload: {
          folder: Partial<appFoldersType>;
          folderId: string;
        };
      }
      | {
        type: 'DELETE_FOLDER';
        payload: string;
      }
  | {
      type: 'ADD_FILE';
      payload: { file: File; folderId: string };
    }
  | {
      type: 'DELETE_FILE';
      payload: { folderId: string; fileId: string };
    }
  | {
      type: 'SET_FILES';
      payload: { folderId: string; files: File[];};
    }
  | {
      type: 'UPDATE_FILE';
      payload: {
        file: Partial<File>;
        folderId: string;
        fileId: string;
      };
    };


const initialState: AppState = { folders: [] };


const appReducer = (
    state: AppState = initialState,
    action: Action
  ): AppState => {
    switch (action.type) {
      case 'SET_FOLDERS':
        return {
            ...state,
            folders:action.payload.folders
            }
        case "ADD_FOLDER":
            return {
                ...state,
                folders:[...state.folders,action.payload]
            }
        case "DELETE_FOLDER":
            return {
                ...state,
                folders:state.folders.filter(folder=>folder.id !== action.payload)
            }
        case "UPDATE_FOLDER":
            return {
                ...state,
                folders:state.folders.map(folder=>{
                    if(folder.id === action.payload.folderId){
                        return {...folder,...action.payload.folder}
                    }
                    return folder;
                })
            }

        case "SET_FILES":
            return {
                ...state,
                folders: state.folders.map((folder) => {
                  if (folder.id === action.payload.folderId) {
                    return {
                      ...folder,
                      files: action.payload.files.sort(
                        (a, b) =>
                        {
                            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                            return dateA - dateB;
                        }
                      ),
                    };
                  }
                  return folder;
                }),
              };
        
            case "ADD_FILE":
                return {
                    ...state,
                    folders: state.folders.map((folder) => {
                      return {
                        ...folder,
                        files: [...folder.files, action.payload.file].sort(
                          (a, b) =>{
                            // new Date(a.createdAt).getTime() -
                            // new Date(b.createdAt).getTime()
                            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                            return dateA - dateB;
                          }
                        ),
                      };
                    }),
                }

            case "DELETE_FILE":
                return {
                    ...state,
                    folders: state.folders.map((folder) => {
                        if (folder.id === action.payload.folderId) {
                            return {
                            ...folder,
                            files: folder.files.filter(
                                (file) => file.id !== action.payload.fileId
                            ),
                            };
                        }
                        return folder;
                    }),
                }
            case "UPDATE_FILE":
                return {
                    ...state,
                    folders: state.folders.map((folder) => {
                        if (folder.id === action.payload.folderId) {
                        return {
                            ...folder,
                            files: folder.files.map((file) => {
                            if (file.id === action.payload.fileId) {
                                return { ...file, ...action.payload.file };
                            }
                            return file;
                            }),
                        };
                        }
                        return folder;
                    }),
                }

    //   case 'ADD_FOLDER':
    //     return {
    //       ...state,
    //       workspaces: state.workspaces.map((workspace) => {
    //         return {
    //           ...workspace,
    //           folders: [...workspace.folders, action.payload.folder].sort(
    //             (a, b) =>{
    //               // new Date(a.createdAt).getTime() -
    //               // new Date(b.createdAt).getTime()
    //               const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    //               const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    //               return dateA - dateB;
    //             }
    //           ),
    //         };
    //       }),
    //     };
    //   case 'UPDATE_FOLDER':
    //     return {
    //       ...state,
    //       workspaces: state.workspaces.map((workspace) => {
    //         if (workspace.id === action.payload.workspaceId) {
    //           return {
    //             ...workspace,
    //             folders: workspace.folders.map((folder) => {
    //               if (folder.id === action.payload.folderId) {
    //                 return { ...folder, ...action.payload.folder };
    //               }
    //               return folder;
    //             }),
    //           };
    //         }
    //         return workspace;
    //       }),
    //     };
    //   case 'DELETE_FOLDER':
    //     return {
    //       ...state,
    //       workspaces: state.workspaces.map((workspace) => {
    //         if (workspace.id === action.payload.workspaceId) {
    //           return {
    //             ...workspace,
    //             folders: workspace.folders.filter(
    //               (folder) => folder.id !== action.payload.folderId
    //             ),
    //           };
    //         }
    //         return workspace;
    //       }),
    //     };
    //   case 'SET_FILES':
    //     return {
    //       ...state,
    //       workspaces: state.workspaces.map((workspace) => {
    //         if (workspace.id === action.payload.workspaceId) {
    //           return {
    //             ...workspace,
    //             folders: workspace.folders.map((folder) => {
    //               if (folder.id === action.payload.folderId) {
    //                 return {
    //                   ...folder,
    //                   files: action.payload.files,
    //                 };
    //               }
    //               return folder;
    //             }),
    //           };
    //         }
    //         return workspace;
    //       }),
    //     };
    //   case 'ADD_FILE':
    //     return {
    //       ...state,
    //       workspaces: state.workspaces.map((workspace) => {
    //         if (workspace.id === action.payload.workspaceId) {
    //           return {
    //             ...workspace,
    //             folders: workspace.folders.map((folder) => {
    //               if (folder.id === action.payload.folderId) {
    //                 return {
    //                   ...folder,
    //                   files: [...folder.files, action.payload.file].sort(
    //                     (a, b) =>
    //                       {
    //                           // new Date(a.createdAt).getTime() -
    //                           // new Date(b.createdAt).getTime()
    //                           const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    //                           const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    //                           return dateA - dateB;
    //                       }
    //                   ),
    //                 };
    //               }
    //               return folder;
    //             }),
    //           };
    //         }
    //         return workspace;
    //       }),
    //     };
    //   case 'DELETE_FILE':
    //     return {
    //       ...state,
    //       workspaces: state.workspaces.map((workspace) => {
    //         if (workspace.id === action.payload.workspaceId) {
    //           return {
    //             ...workspace,
    //             folder: workspace.folders.map((folder) => {
    //               if (folder.id === action.payload.folderId) {
    //                 return {
    //                   ...folder,
    //                   files: folder.files.filter(
    //                     (file) => file.id !== action.payload.fileId
    //                   ),
    //                 };
    //               }
    //               return folder;
    //             }),
    //           };
    //         }
    //         return workspace;
    //       }),
    //     };
    //   case 'UPDATE_FILE':
    //     return {
    //       ...state,
    //       workspaces: state.workspaces.map((workspace) => {
    //         if (workspace.id === action.payload.workspaceId) {
    //           return {
    //             ...workspace,
    //             folders: workspace.folders.map((folder) => {
    //               if (folder.id === action.payload.folderId) {
    //                 return {
    //                   ...folder,
    //                   files: folder.files.map((file) => {
    //                     if (file.id === action.payload.fileId) {
    //                       return {
    //                         ...file,
    //                         ...action.payload.file,
    //                       };
    //                     }
    //                     return file;
    //                   }),
    //                 };
    //               }
    //               return folder;
    //             }),
    //           };
    //         }
    //         return workspace;
    //       }),
    //     };
      default:
        return initialState;
    }
  };


const AppStateContext = createContext< 
    |{  state:AppState,
        dispatch:Dispatch<Action>,
        folderId:string | undefined,
        fileId:string | undefined
    } 
    | undefined
>(undefined);

interface AppStateProviderProps {
    children: React.ReactNode;
}

const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState); // the equivalent of useState but for complex states
    //the appReducer is the reducer function which takes the current state and the action and returns the new state
    //the intitial state is the initial state of the global state
    const pathname = usePathname();
    //returns the current pathname of the URL
  
    const folderId = useMemo(() => {
      const urlSegments = pathname?.split('/').filter(Boolean);//split the pathname by / and remove any empty strings
      if (urlSegments)
        if (urlSegments.length > 1) {
          return urlSegments[1];//return the second element of the array
        }
    }, [pathname]);
    //the useMemo hook is used to memorize the value of the workspaceId
    //between renders. It only changes when the pathname changes
  
    const fileId = useMemo(() => {
      const urlSegments = pathname?.split('/').filter(Boolean);
      if (urlSegments)
        if (urlSegments?.length > 2) {
          return urlSegments[2];
        }
    }, [pathname]);

  
    useEffect(() => {
      if (!folderId) return;
      const fetchFiles = async () => {
        const { error: filesError, data } = await getFilesFromFolderId(folderId);
        if (filesError) {
          console.log(filesError);
        }
        if (!data) return;
        dispatch({
          type: 'SET_FILES',
          payload: { files: data as File[], folderId },
        });
      };
      fetchFiles();
    }, [folderId]);//fetch the files when the folderId or the workspaceId changes
    //in order to make it more optimized
  
    useEffect(() => {
      // console.log('App State Changed', state);
    }, [state]);
  
    return (
      <AppStateContext.Provider
        value={{ state, dispatch, folderId, fileId }}
      >
        {children}
      </AppStateContext.Provider>
    );
  };

export default AppStateProvider;


export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  // console.log("contextxxxxxxx: ",context)
  return context;
};
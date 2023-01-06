export declare function getPlayers(): Promise<any>;
export declare function getPlayersToCSV(): Promise<void>;
export declare function getParents(): Promise<import("pg").QueryResult<any>>;
export declare function getPlayerById(id: string): Promise<any>;
export declare function getPlayerByName(name: string): Promise<any>;
export declare function getPlayerBySurname(name: string): Promise<any>;
export declare function getPlayerByPosition(position: string): Promise<any>;
export declare function addPlayer(i: any): Promise<any>;
export declare function updatePlayer(i: any): Promise<any>;
export declare function deletePlayerById(id: any): Promise<any>;
export declare function existPlayerWithId(id: any): Promise<boolean>;

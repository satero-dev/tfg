import { getApp } from "@firebase/app";
import { User } from "@firebase/auth";
import { addDoc, collection, getFirestore, onSnapshot, query, snapshotEqual, where} from "firebase/firestore";
import { Building } from "../../types";


export class MapDatabase {
    private readonly buildings = "buildings";

    async add(building: Building) {
        const dbInstance = getFirestore(getApp());
        const { lat, lng, userID } = building;
        const result = await addDoc(collection(dbInstance, this.buildings),{
            lat,
            lng,
            userID,
        });
        return result.id;
    }  
    

    //Leemos los edificios desde Firebase
    async getBuildings(user: User) {
        const dbInstance = getFirestore(getApp());
        const q = query(
            collection(dbInstance, this.buildings),
            //Aquí solo leemos los de mi usuario, esto cambiarlo por perfiles
            where("userID", "==", user.uid)
        );

        return new Promise<Building[]>((resolve) => {
            const unsuscribe = onSnapshot(q, (snapshot) => {
                const result:Building[] = [];
                snapshot.docs.forEach((doc) => {
                    result.push({...(doc.data() as Building), uid: doc.id});                    
                });
                unsuscribe();
                resolve(result);
            });
        });
    }
    
}


import {Client ,Account ,ID , Query , Databases, Storage} from 'appwrite'
import conf from '../../config/conf'

export class AuthService{
    client = new Client();
    Account;
    Databases;
    storage;

    constructor () {
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)
        this.Account = new Account(this.client)
        this.database = new Databases(this.client)
         this.storage = new Storage(this.client);
    }
async createuser(data) {
  const { name, email, password, phone } = data;
  try {
    const user = await this.Account.create(ID.unique(), email, password, name);
    if (user) {
      await this.login({ email, password });
      await this.database.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        {
          name,
          email,
          number: phone,
          userid: user.$id,
          status: "online",
          lastseen: new Date().toISOString(),
          imageurl: "",
          description: "",
          Gender : ""
        }
      );
    }
    return user;
  } catch (error) {
    console.log("Create user", error);
    throw error;
  }
}
// Inside AuthService class
listenToMessages(chatId, callback) {
  return this.client.subscribe(
    `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteuserCollectionId}.documents`,
    (response) => {
      if (
        response.events.includes('databases.*.collections.*.documents.*.create') &&
        response.payload.chatid === chatId
      ) {
        callback(response.payload); // send new message to callback
      }
    }
  );
}

async deleteFile(id) {
  if (!id) {
    console.error("deleteFile :: error :: No fileId provided");
    return false;
  }

  try {
    console.log("Attempting to delete file:", id);
    await this.storage.deleteFile(conf.appwriteBucketId, id);
    return true;
  } catch (error) {
    console.error("Appwrite service :: deleteFile :: error", error.message);
    return false;
  }
}

async updateuser(id, name, email, number, description, newimageurl, imageurl, Gender, currentPassword) {
  try {
    const existingDoc = await this.database.getDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      id
    );

    if (!existingDoc) {
      console.error("updateuser :: error :: Document not found:", id);
      return false;
    }
    let imageid = imageurl;
    if (newimageurl && imageurl) {
      await this.deleteFile(imageurl);
      const uploaded = await this.getfiles(newimageurl);
      if (!uploaded) throw new Error("Image upload failed");
      imageid = uploaded.$id;
    }

    try {
      if (name !== existingDoc.name) {
        await this.Account.updateName(name);
      }

      if (email !== existingDoc.email) {
        await this.Account.updateEmail(email, currentPassword);
      }
    } catch (authError) {
      console.error("Auth update failed:", authError);
    }

    const updatedDoc = await this.database.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      id,
      {
        name,
        email,
        number,
        imageurl: imageid,
        description,
        Gender
      }
    );

    return updatedDoc;

  } catch (error) {
    console.error("Appwrite service :: updateuser :: error", error);
    return false;
  }
}
  
async login({email,password}) {
        return this.Account.createEmailPasswordSession(email ,password)
    }

async getcurrentuser() {
  try {
    const useraccount = await this.Account.get();
    if (!useraccount) return null;

    // Get profile document
    const profile = await this.getuserprofilebyemail(useraccount.email);
    if (!profile) return null;

    // Mark user online
    await this.updateUserStatus(profile.$id, "online");

    // Return ACTUAL PROFILE instead of account
    return profile;

  } catch (error) {
    console.log("getcurrentuser error:", error);
    return null;
  }
}

async logout(email) {
  try {
    if (!email) {
      const account = await this.getcurrentuser();
      email = account.email;
    }

    const userDoc = await this.getuserprofilebyemail(email);
    if (userDoc) {
      await this.updateUserStatus(userDoc.$id, "offline");
    }

    await this.Account.deleteSessions();
  } catch (error) {
    console.log("logout error", error);
    throw error;
  }
}

async updateUserStatus(userDocId, newStatus) {
  try {
    await this.database.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      userDocId,
      {
        status: newStatus,
        lastseen: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error("Failed to update status:", error);
  }
}
 async getfiles(file) {
    try {
      const uploaded = await this.storage.createFile(conf.appwriteBucketId, ID.unique(), file);
      console.log('Uploaded File:', uploaded);
      return uploaded;
    } catch (error) {
      console.error('Appwrite :: getfiles :: error', error);
      return null;
    }
  }

 async updateUserimage(userDocId, fileId) {
    try {
      await this.database.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        userDocId,
        {
          imageurl: fileId,
        }
      );
    } catch (error) {
      console.error('Failed to update user image:', error);
    }
  }


 async getuserprofilebyemail(email) {
  try {
    const response = await this.database.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      [Query.equal("email", email)]
    );
    return response.documents[0] || null;
  } catch (error) {
    console.log("get user profile error", error);
    throw error;
  }
}


async getAllUsersExceptCurrent(email) {
  try {
    const response = await this.database.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      [
        Query.notEqual("email", email)
      ]
    );
    return response.documents;
  } catch (error) {
    console.log("get all users except current error", error);
    throw error;
  }
}

async storemessageindatabase(senderid, receiverid, content, time, chatid, imageId = null) {
  try {
    return await this.database.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteuserCollectionId,
      ID.unique(),
      {
        senderid,
        receiverid,
        content,
        time,
        chatid,
        imageid: imageId,
      }
    );
  } catch (error) {
    console.error("Appwrite service :: storemessageindatabase :: error", error);
    throw error;
  }
}

async getMessagesByChatId(chatid) {
  try {
    const response = await this.database.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteuserCollectionId,
      [
        Query.equal('chatid', chatid),
        Query.orderAsc('time'), 
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('Appwrite service :: getMessagesByChatId :: error', error);
    throw error;
  }
}

async getLastMessageByChatIdInProfile(chatid) {
  try {
    const response = await this.database.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteuserCollectionId,
      [
        Query.equal('chatid', chatid),
        Query.orderDesc('time'),  
        Query.limit(1),         
      ]
    );

    return response.documents[0] || null;
  } catch (error) {
    console.error('Appwrite service :: getLastMessageByChatId :: error', error);
    throw error;
  }
}

async deletemessage (id) {
  try {
    await this.database.deleteDocument(
       conf.appwriteDatabaseId,
          conf.appwriteuserCollectionId,
          id,
      )
      return true;
  } catch (error) {
    console.log("appwrite error :: deletemessage :: error", error);
    
  }
}


}
const authservice = new AuthService();
export default authservice;
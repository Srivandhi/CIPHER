import { db } from './firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp, addDoc } from "firebase/firestore";

export const alertService = {
    // Subscribe to Active Alerts
    subscribeToActive: (user, callback) => {
        const alertsRef = collection(db, "bank_alerts");

        // console.log("Fetching ALL Pending Alerts for Client-Side Filtering...");

        const q = query(
            alertsRef,
            where("status", "==", "Pending")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allAlerts = snapshot.docs.map(doc => {
                const data = doc.data();
                const numericScore = parseFloat(data.risk_score) || 0;

                return {
                    id: doc.id,
                    ...data,
                    atmName: data.atm_name,
                    atmId: data.atm_id,
                    location: data.atm_location,
                    bankName: data.bank_name,
                    probability: numericScore > 1 ? numericScore / 100 : numericScore,
                    riskScore: numericScore,
                    riskClass: data.risk_class,
                    complaint_id: data.complaint_id,
                    fraudType: data.fraud_type,
                    aiExplanation: data.ai_explanation,
                    estimatedLoss: data.estimated_loss
                };
            });

            // Client-side Filtering
            const filteredAlerts = allAlerts.filter(alert => {
                // If user is a Police Officer, we might still want location filtering if required later,
                // but for now the specific request is about Bank Name filtering.
                // Assuming we keep the Zone logic for Police if they exist, or just focus on Bank.

                if (user.role === 'Police Officer') {
                    // Exact match on location for Police (implicit rule from before, safer to keep)
                    return alert.location === user.zone;
                } else {
                    // Bank Officer: Substring match on ATM Name
                    // "PNB" matches "PNB ATM" or "ATM PNB 001"
                    if (!alert.atmName) return false;
                    const bankName = (user.bankName || "").trim().toUpperCase();
                    if (!bankName) return true; // Safety: show all if no bank name registered

                    return alert.atmName.toUpperCase().includes(bankName);
                }
            });

            // Sort by riskScore descending
            filteredAlerts.sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));

            callback(filteredAlerts);
        }, (error) => {
            console.error("Error fetching alerts:", error);
            callback([]);
        });

        return unsubscribe;
    },

    // Subscribe to History (Completed Alerts)
    subscribeToHistory: (user, callback) => {
        const alertsRef = collection(db, "bank_alerts");
        const q = query(
            alertsRef,
            where("status", "==", "Resolved")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allHistory = snapshot.docs.map(doc => {
                const data = doc.data();
                const numericScore = parseFloat(data.risk_score) || 0;
                return {
                    id: doc.id,
                    ...data,
                    atmName: data.atm_name,
                    location: data.atm_location,
                    riskClass: data.risk_class,
                    probability: numericScore > 1 ? numericScore / 100 : numericScore,
                    timestamp: data.resolved_at?.toDate()?.toISOString() || new Date().toISOString(),
                    complaint_id: data.complaint_id,
                    action: data.action_taken || "Resolved"
                };
            });

            // Client-side Filtering
            const filteredHistory = allHistory.filter(item => {
                if (user.role === 'Police Officer') {
                    return item.location === user.zone;
                } else {
                    if (!item.atmName) return false;
                    const bankName = (user.bankName || "").trim().toUpperCase();
                    if (!bankName) return true;
                    return item.atmName.toUpperCase().includes(bankName);
                }
            });

            filteredHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            callback(filteredHistory);
        }, (error) => {
            console.error("Error fetching history:", error);
            callback([]);
        });

        return unsubscribe;
    },

    // Mark an alert as resolved
    resolveAlert: async (alert) => {
        try {
            const alertRef = doc(db, "bank_alerts", alert.id);
            await updateDoc(alertRef, {
                status: "Resolved",
                resolved_at: serverTimestamp(),
                action_taken: "Intervention Completed"
            });

            // Notification for User Layer
            await addDoc(collection(db, "resolutions"), {
                complaint_id: alert.complaint_id || "UNKNOWN_ID",
                message: "complaint resolved",
                timestamp: serverTimestamp(),
                atm_name: alert.atmName
            });

            return true;
        } catch (e) {
            console.error("Error resolving alert:", e);
            throw e;
        }
    }
};

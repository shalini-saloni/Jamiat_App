import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Switch, Alert, Modal
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000];
const DONATION_TYPES = [
  { key: 'Zakat', label: 'Zakat', icon: 'mosque' },
  { key: 'Sadaqa', label: 'Sadaqa', icon: 'hand-holding-heart' },
  { key: 'Lillah', label: 'Lillah', icon: 'heart' },
];
const PAYMENT_METHODS = [
  { key: 'upi', label: 'UPI (GPay, PhonePe, etc.)', icon: 'phone-portrait-outline' },
  { key: 'card', label: 'Credit / Debit Card', icon: 'card-outline' },
  { key: 'netbank', label: 'Net Banking', icon: 'laptop-outline' },
];

export default function DonationScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { user, addDonation } = useApp();
  const campaign = route?.params?.campaign;
  const initType = route?.params?.donationType || 'Zakat';

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(initType);
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount;

  const handleComplete = () => {
    if (currentAmount < 1) {
      Alert.alert('Invalid Amount', 'Please enter a valid donation amount.');
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      // Add to dashboard
      addDonation({
        name: campaign ? campaign.title : `${selectedType} Donation`,
        amount: currentAmount,
        type: selectedType,
        campaign: campaign?.title || null,
        icon: selectedType === 'Zakat' ? 'moon' : selectedType === 'Sadaqa' ? 'heart' : 'star',
        recurring,
      });
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <View style={[styles.successContainer, { paddingTop: insets.top }]}>
        <View style={styles.successCard}>
          <View style={styles.successCircle}>
            <Text style={{ fontSize: 48 }}>✅</Text>
          </View>
          <Text style={styles.successTitle}>Jazakallah Khayran!</Text>
          <Text style={styles.successSubtitle}>Your donation of</Text>
          <Text style={styles.successAmount}>₹{currentAmount.toLocaleString()}</Text>
          <Text style={styles.successType}>{selectedType} • {campaign?.title || 'General Donation'}</Text>
          <Text style={styles.successMsg}>May Allah accept your contribution and multiply your reward.</Text>
          <View style={styles.successBtns}>
            <TouchableOpacity style={styles.viewImpactBtn} onPress={() => { setSuccess(false); navigation.navigate('MyImpact'); }}>
              <Text style={styles.viewImpactBtnText}>View My Impact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeBtn} onPress={() => { setSuccess(false); navigation.navigate('Home'); }}>
              <Text style={styles.homeBtnText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Support Jamiat</Text>
          {campaign && <Text style={styles.headerSub} numberOfLines={1}>{campaign.title}</Text>}
        </View>
        <View style={styles.secureBadge}>
          <Ionicons name="shield-checkmark" size={12} color="#1B8A4C" />
          <Text style={styles.secureText}>SECURE</Text>
        </View>
      </View>

      {/* Steps */}
      <View style={styles.stepsRow}>
        {['Amount', 'Payment', 'Confirm'].map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepCircle, step > i ? styles.stepDone : step === i + 1 ? styles.stepActive : styles.stepInactive]}>
              {step > i + 1 ? <Ionicons name="checkmark" size={14} color="#fff" /> : <Text style={[styles.stepNum, step === i + 1 && { color: '#fff' }]}>{i + 1}</Text>}
            </View>
            <Text style={[styles.stepLabel, step === i + 1 && styles.stepLabelActive]}>{s}</Text>
            {i < 2 && <View style={[styles.stepLine, step > i + 1 && styles.stepLineDone]} />}
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Campaign badge */}
        {campaign && (
          <View style={[styles.campaignBadge, { backgroundColor: campaign.color || '#1B6B3A' }]}>
            <Text style={{ fontSize: 20 }}>{campaign.emoji}</Text>
            <Text style={styles.campaignBadgeText}>{campaign.title}</Text>
          </View>
        )}

        {/* Donation Type */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>DONATION TYPE</Text>
            {selectedType === 'Zakat' && <View style={styles.taxBadge}><Text style={styles.taxText}>80G TAX BENEFIT</Text></View>}
          </View>
          <View style={styles.typeRow}>
            {DONATION_TYPES.map((t) => (
              <TouchableOpacity key={t.key} style={[styles.typeBtn, selectedType === t.key && styles.typeBtnActive]} onPress={() => setSelectedType(t.key)}>
                <FontAwesome5 name={t.icon} size={18} color={selectedType === t.key ? '#fff' : '#1B8A4C'} />
                <Text style={[styles.typeBtnText, selectedType === t.key && styles.typeBtnTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Select Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELECT AMOUNT</Text>
          <View style={styles.amountGrid}>
            {PRESET_AMOUNTS.map((amt) => (
              <TouchableOpacity key={amt} style={[styles.amountBtn, selectedAmount === amt && !customAmount && styles.amountBtnActive]} onPress={() => { setSelectedAmount(amt); setCustomAmount(''); }}>
                <Text style={[styles.amountText, selectedAmount === amt && !customAmount && styles.amountTextActive]}>
                  ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.customRow}>
            <Ionicons name="create-outline" size={16} color="#999" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.customInput}
              placeholder="₹ Enter custom amount"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={customAmount}
              onChangeText={(v) => { setCustomAmount(v); setSelectedAmount(0); }}
            />
          </View>
          {currentAmount > 0 && (
            <View style={styles.amountPreview}>
              <Text style={styles.amountPreviewText}>You are donating: </Text>
              <Text style={styles.amountPreviewNum}>₹{currentAmount.toLocaleString()}</Text>
            </View>
          )}
        </View>

        {/* Recurring */}
        <View style={styles.section}>
          <View style={[styles.recurringRow, recurring && styles.recurringRowActive]}>
            <View style={styles.recurringLeft}>
              <View style={styles.recurringIcon}><Ionicons name="refresh" size={18} color="#1B8A4C" /></View>
              <View>
                <Text style={styles.recurringTitle}>Monthly Recurring</Text>
                <Text style={styles.recurringSubtitle}>Automate your monthly charity</Text>
              </View>
            </View>
            <Switch value={recurring} onValueChange={setRecurring} trackColor={{ false: '#ddd', true: '#1B8A4C' }} thumbColor="#fff" />
          </View>
        </View>

        {/* Donor Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>DONOR DETAILS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}><Text style={styles.editText}>Edit</Text></TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{user?.name || '—'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email Address</Text>
            <Text style={styles.detailValue}>{user?.email || '—'}</Text>
          </View>
          {user?.phone ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{user.phone}</Text>
            </View>
          ) : null}
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SECURE PAYMENT</Text>
          {PAYMENT_METHODS.map((pm) => (
            <TouchableOpacity key={pm.key} style={[styles.paymentOption, paymentMethod === pm.key && styles.paymentOptionActive]} onPress={() => setPaymentMethod(pm.key)}>
              <View style={[styles.radio, paymentMethod === pm.key && styles.radioActive]}>
                {paymentMethod === pm.key && <View style={styles.radioDot} />}
              </View>
              <Ionicons name={pm.icon} size={18} color={paymentMethod === pm.key ? '#1B8A4C' : '#666'} style={{ marginRight: 10 }} />
              <Text style={[styles.paymentLabel, paymentMethod === pm.key && { color: '#1B8A4C', fontWeight: '600' }]}>{pm.label}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.encryptNote}>🔒 100% Secure SSL Encrypted Transaction</Text>
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>TOTAL AMOUNT</Text>
            <Text style={styles.summaryType}>TYPE: {selectedType.toUpperCase()}</Text>
          </View>
          <Text style={styles.totalAmount}>₹{currentAmount.toLocaleString()}.00</Text>
          {recurring && <Text style={styles.recurringNote}>↻ Monthly auto-debit enabled</Text>}
        </View>

        <TouchableOpacity style={[styles.completeBtn, processing && { opacity: 0.7 }]} onPress={handleComplete} disabled={processing}>
          <Text style={styles.completeBtnText}>{processing ? 'Processing...' : 'Complete Donation →'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  successContainer: { flex: 1, backgroundColor: '#F0FFF4', alignItems: 'center', justifyContent: 'center', padding: 24 },
  successCard: { backgroundColor: '#fff', borderRadius: 20, padding: 28, alignItems: 'center', width: '100%', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12, elevation: 6 },
  successCircle: { marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#1B8A4C', marginBottom: 8 },
  successSubtitle: { fontSize: 13, color: '#888', marginBottom: 2 },
  successAmount: { fontSize: 36, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  successType: { fontSize: 13, color: '#888', marginBottom: 16 },
  successMsg: { fontSize: 13, color: '#555', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  successBtns: { width: '100%', gap: 10 },
  viewImpactBtn: { backgroundColor: '#1B8A4C', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  viewImpactBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  homeBtn: { borderWidth: 1.5, borderColor: '#1B8A4C', paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  homeBtnText: { color: '#1B8A4C', fontWeight: '700', fontSize: 15 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  headerSub: { fontSize: 11, color: '#888', marginTop: 1 },
  secureBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, gap: 4 },
  secureText: { fontSize: 10, color: '#1B8A4C', fontWeight: '700' },
  stepsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, backgroundColor: '#fff', paddingHorizontal: 24 },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  stepActive: { backgroundColor: '#1B8A4C' },
  stepDone: { backgroundColor: '#1B8A4C' },
  stepInactive: { backgroundColor: '#E0E0E0' },
  stepNum: { fontSize: 13, fontWeight: '600', color: '#999' },
  stepLabel: { fontSize: 12, color: '#999', marginRight: 6 },
  stepLabelActive: { color: '#1B8A4C', fontWeight: '600' },
  stepLine: { width: 28, height: 2, backgroundColor: '#E0E0E0', marginHorizontal: 4 },
  stepLineDone: { backgroundColor: '#1B8A4C' },
  campaignBadge: { marginHorizontal: 16, marginTop: 12, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  campaignBadgeText: { color: '#fff', fontWeight: '700', fontSize: 14, flex: 1 },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#999', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 },
  taxBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 12 },
  taxText: { fontSize: 9, color: '#F57C00', fontWeight: '700', letterSpacing: 0.3 },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 2, borderColor: '#E8F5E9', backgroundColor: '#F9FFF9', gap: 6 },
  typeBtnActive: { backgroundColor: '#1B8A4C', borderColor: '#1B8A4C' },
  typeBtnText: { fontSize: 12, color: '#1B8A4C', fontWeight: '600' },
  typeBtnTextActive: { color: '#fff' },
  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  amountBtn: { width: '30%', paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#E0E0E0', alignItems: 'center', backgroundColor: '#fff' },
  amountBtnActive: { backgroundColor: '#1B8A4C', borderColor: '#1B8A4C' },
  amountText: { fontSize: 14, fontWeight: '600', color: '#444' },
  amountTextActive: { color: '#fff' },
  customRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  customInput: { flex: 1, fontSize: 14, color: '#333' },
  amountPreview: { flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'center' },
  amountPreviewText: { fontSize: 13, color: '#888' },
  amountPreviewNum: { fontSize: 16, fontWeight: '800', color: '#1B8A4C' },
  recurringRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FFF9', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E8F5E9' },
  recurringRowActive: { borderColor: '#1B8A4C' },
  recurringLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recurringIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center' },
  recurringTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  recurringSubtitle: { fontSize: 11, color: '#999', marginTop: 2 },
  editText: { color: '#1B8A4C', fontSize: 13, fontWeight: '600', marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  detailLabel: { fontSize: 13, color: '#888' },
  detailValue: { fontSize: 13, color: '#333', fontWeight: '500', flex: 1, textAlign: 'right' },
  paymentOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#F0F0F0', marginBottom: 10 },
  paymentOptionActive: { borderColor: '#1B8A4C', backgroundColor: '#F0FFF4' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#ccc', marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#1B8A4C' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1B8A4C' },
  paymentLabel: { flex: 1, fontSize: 14, color: '#444' },
  encryptNote: { textAlign: 'center', fontSize: 11, color: '#999', marginTop: 8 },
  summarySection: { marginHorizontal: 16, marginTop: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryLabel: { fontSize: 11, fontWeight: '700', color: '#999', letterSpacing: 0.5 },
  summaryType: { fontSize: 11, color: '#999' },
  totalAmount: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  recurringNote: { fontSize: 12, color: '#1B8A4C', fontWeight: '500', marginBottom: 12 },
  completeBtn: { marginHorizontal: 16, marginTop: 8, backgroundColor: '#1B8A4C', paddingVertical: 16, borderRadius: 14, alignItems: 'center', shadowColor: '#1B8A4C', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  completeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

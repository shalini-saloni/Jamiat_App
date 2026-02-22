import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Switch, Alert
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000];
const DONATION_TYPES = [
  { key: 'zakat', label: 'Zakat', icon: 'mosque', taxBenefit: true },
  { key: 'sadaqa', label: 'Sadaqa', icon: 'hand-holding-heart', taxBenefit: false },
  { key: 'lillah', label: 'Lillah', icon: 'heart', taxBenefit: false },
];
const PAYMENT_METHODS = [
  { key: 'upi', label: 'UPI (GPay, PhonePe, etc.)', icon: 'phone-portrait-outline' },
  { key: 'card', label: 'Credit / Debit Card', icon: 'card-outline' },
  { key: 'netbank', label: 'Net Banking', icon: 'laptop-outline' },
];

export default function DonationScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('zakat');
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const currentAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount;
  const serviceFee = Math.round(currentAmount * 0.01);
  const total = currentAmount + serviceFee;

  const handleComplete = () => {
    Alert.alert('Jazakallah Khayran!', `Your donation of ₹${total.toLocaleString()} has been received. May Allah accept your contribution.`, [
      { text: 'OK', onPress: () => navigation.navigate('Impact') }
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Jamiat</Text>
        <View style={styles.secureBadge}>
          <Ionicons name="shield-checkmark" size={12} color="#1B8A4C" />
          <Text style={styles.secureText}>SECURE</Text>
        </View>
      </View>

      {/* Steps */}
      <View style={styles.stepsRow}>
        {['Amount', 'Payment', 'Impact'].map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepCircle, step > i ? styles.stepDone : step === i + 1 ? styles.stepActive : styles.stepInactive]}>
              {step > i + 1 ? (
                <Ionicons name="checkmark" size={14} color="#fff" />
              ) : (
                <Text style={[styles.stepNum, step === i + 1 && { color: '#fff' }]}>{i + 1}</Text>
              )}
            </View>
            <Text style={[styles.stepLabel, step === i + 1 && styles.stepLabelActive]}>{s}</Text>
            {i < 2 && <View style={[styles.stepLine, step > i + 1 && styles.stepLineDone]} />}
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Donation Type */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DONATION TYPE</Text>
            {selectedType === 'zakat' && (
              <View style={styles.taxBadge}>
                <Text style={styles.taxText}>80G TAX BENEFIT</Text>
              </View>
            )}
          </View>
          <View style={styles.typeRow}>
            {DONATION_TYPES.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[styles.typeBtn, selectedType === t.key && styles.typeBtnActive]}
                onPress={() => setSelectedType(t.key)}
              >
                <FontAwesome5
                  name={t.icon}
                  size={18}
                  color={selectedType === t.key ? '#fff' : '#1B8A4C'}
                />
                <Text style={[styles.typeBtnText, selectedType === t.key && styles.typeBtnTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Select Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELECT AMOUNT</Text>
          <View style={styles.amountGrid}>
            {PRESET_AMOUNTS.map((amt) => (
              <TouchableOpacity
                key={amt}
                style={[styles.amountBtn, selectedAmount === amt && !customAmount && styles.amountBtnActive]}
                onPress={() => { setSelectedAmount(amt); setCustomAmount(''); }}
              >
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
        </View>

        {/* Monthly Recurring */}
        <View style={styles.section}>
          <View style={[styles.recurringRow, recurring && styles.recurringRowActive]}>
            <View style={styles.recurringLeft}>
              <View style={styles.recurringIcon}>
                <Ionicons name="refresh" size={18} color="#1B8A4C" />
              </View>
              <View>
                <Text style={styles.recurringTitle}>Monthly Recurring</Text>
                <Text style={styles.recurringSubtitle}>Automate your monthly charity</Text>
              </View>
            </View>
            <Switch
              value={recurring}
              onValueChange={setRecurring}
              trackColor={{ false: '#ddd', true: '#1B8A4C' }}
              thumbColor="#fff"
              style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
            />
          </View>
        </View>

        {/* Donor Details */}
        <View style={styles.section}>
          <View style={styles.donorHeader}>
            <Text style={styles.sectionTitle}>DONOR DETAILS</Text>
            <TouchableOpacity><Text style={styles.editText}>Edit</Text></TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>Ahmed Siddiqui</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email Address</Text>
            <Text style={styles.detailValue}>ahmed.s@example.com</Text>
          </View>
        </View>

        {/* Secure Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SECURE PAYMENT</Text>
          {PAYMENT_METHODS.map((pm) => (
            <TouchableOpacity
              key={pm.key}
              style={[styles.paymentOption, paymentMethod === pm.key && styles.paymentOptionActive]}
              onPress={() => setPaymentMethod(pm.key)}
            >
              <View style={[styles.radio, paymentMethod === pm.key && styles.radioActive]}>
                {paymentMethod === pm.key && <View style={styles.radioDot} />}
              </View>
              <Ionicons name={pm.icon} size={18} color={paymentMethod === pm.key ? '#1B8A4C' : '#666'} style={{ marginRight: 10 }} />
              <Text style={[styles.paymentLabel, paymentMethod === pm.key && { color: '#1B8A4C', fontWeight: '600' }]}>
                {pm.label}
              </Text>
              {pm.key === 'upi' && (
                <View style={styles.paymentLogos}>
                  <Text style={styles.payLogo}>G</Text>
                  <Text style={styles.payLogo}>P</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
          <Text style={styles.encryptNote}>🔒 100% Secure SSL Encrypted Transaction</Text>
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>TOTAL AMOUNT</Text>
            <Text style={styles.summaryType}>TYPE: {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</Text>
          </View>
          <Text style={styles.totalAmount}>₹{currentAmount.toLocaleString()}.00</Text>
        </View>

        <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
          <Text style={styles.completeBtnText}>Complete Donation →</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  secureBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, gap: 4 },
  secureText: { fontSize: 10, color: '#1B8A4C', fontWeight: '700', letterSpacing: 0.5 },
  stepsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, backgroundColor: '#fff', paddingHorizontal: 24 },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  stepActive: { backgroundColor: '#1B8A4C' },
  stepDone: { backgroundColor: '#1B8A4C' },
  stepInactive: { backgroundColor: '#E0E0E0' },
  stepNum: { fontSize: 13, fontWeight: '600', color: '#999' },
  stepLabel: { fontSize: 12, color: '#999', marginRight: 8 },
  stepLabelActive: { color: '#1B8A4C', fontWeight: '600' },
  stepLine: { width: 30, height: 2, backgroundColor: '#E0E0E0', marginHorizontal: 4 },
  stepLineDone: { backgroundColor: '#1B8A4C' },
  scroll: { flex: 1 },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#999', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 },
  taxBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
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
  recurringRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FFF9', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E8F5E9' },
  recurringRowActive: { borderColor: '#1B8A4C' },
  recurringLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recurringIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center' },
  recurringTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  recurringSubtitle: { fontSize: 11, color: '#999', marginTop: 2 },
  donorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 },
  editText: { color: '#1B8A4C', fontSize: 13, fontWeight: '600' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  detailLabel: { fontSize: 13, color: '#888' },
  detailValue: { fontSize: 13, color: '#333', fontWeight: '500' },
  paymentOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#F0F0F0', marginBottom: 10 },
  paymentOptionActive: { borderColor: '#1B8A4C', backgroundColor: '#F0FFF4' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#ccc', marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#1B8A4C' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1B8A4C' },
  paymentLabel: { flex: 1, fontSize: 14, color: '#444' },
  paymentLogos: { flexDirection: 'row', gap: 6 },
  payLogo: { width: 22, height: 22, borderRadius: 4, backgroundColor: '#E0E0E0', textAlign: 'center', lineHeight: 22, fontSize: 10, fontWeight: '700', color: '#555' },
  encryptNote: { textAlign: 'center', fontSize: 11, color: '#999', marginTop: 8 },
  summarySection: { marginHorizontal: 16, marginTop: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryLabel: { fontSize: 11, fontWeight: '700', color: '#999', letterSpacing: 0.5 },
  summaryType: { fontSize: 11, color: '#999' },
  totalAmount: { fontSize: 26, fontWeight: '800', color: '#1A1A1A', marginBottom: 16 },
  completeBtn: { marginHorizontal: 16, backgroundColor: '#1B8A4C', paddingVertical: 16, borderRadius: 14, alignItems: 'center', shadowColor: '#1B8A4C', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  completeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

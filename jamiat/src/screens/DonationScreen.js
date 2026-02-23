import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Switch, Alert,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const DONATION_TYPES = [
  { key: 'Zakat',    label: 'Zakat',    icon: 'mosque' },
  { key: 'Sadaqa',   label: 'Sadaqa',   icon: 'hand-holding-heart' },
  { key: 'Fitrana',  label: 'Fitrana',  icon: 'utensils' },
  { key: 'General',  label: 'General',  icon: 'infinity' },
];

const DEDICATE_OPTIONS = ['For Myself', 'For Loved One', 'In Memory Of'];

const FREQUENCY_OPTIONS = [
  { key: 'One-Time', label: 'One-Time' },
  { key: 'Daily',    label: 'Daily' },
  { key: 'Weekly',   label: 'Weekly' },
  { key: 'Monthly',  label: 'Monthly' },
  { key: 'Yearly',   label: 'Yearly' },
];

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000, 15000, 25000];

export default function DonationScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { user, addDonation } = useApp();
  const campaign  = route?.params?.campaign;
  const initType  = route?.params?.donationType || 'Zakat';
  const initFreq  = route?.params?.frequency    || 'One-Time';

  const [selectedType,    setSelectedType]    = useState(initType);
  const [dedicate,        setDedicate]        = useState('For Myself');
  const [frequency,       setFrequency]       = useState(initFreq);
  const [selectedAmount,  setSelectedAmount]  = useState(1000);
  const [customAmount,    setCustomAmount]    = useState('');
  const [taxBenefit,      setTaxBenefit]      = useState(true);
  const [message,         setMessage]         = useState('');
  const [processing,      setProcessing]      = useState(false);
  const [success,         setSuccess]         = useState(false);
  const [finalAmount,     setFinalAmount]     = useState(0);

  const currentAmount = customAmount ? (parseInt(customAmount) || 0) : selectedAmount;
  const processingFee = 0;
  const totalContribution = currentAmount + processingFee;

  const handleProceed = () => {
    if (currentAmount < 50) {
      Alert.alert('Minimum Amount', 'Minimum donation amount is ₹50.');
      return;
    }
    setProcessing(true);
    setTimeout(async () => {
      setProcessing(false);
      setFinalAmount(currentAmount);
      await addDonation({
        name:      campaign ? campaign.title : `${selectedType} Donation`,
        amount:    currentAmount,
        type:      selectedType,
        campaign:  campaign?.title || null,
        frequency,
        dedicate,
        icon:      selectedType === 'Zakat' ? 'moon' : selectedType === 'Sadaqa' ? 'heart' : 'star',
        recurring: frequency !== 'One-Time',
      });
      setSuccess(true);
    }, 1400);
  };

  const goHome = () => {
    if (navigation.canGoBack()) navigation.popToTop();
    else navigation.navigate('Tabs');
  };

  const goImpact = () => {
    if (navigation.canGoBack()) navigation.popToTop();
    navigation.navigate('MyImpact');
  };

  if (success) {
    return (
      <View style={[styles.successBg, { paddingTop: insets.top }]}>
        <View style={styles.successCard}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successTitle}>Jazakallah Khayran!</Text>
          <Text style={styles.successSub}>Your donation of</Text>
          <Text style={styles.successAmount}>₹{finalAmount.toLocaleString()}</Text>
          <Text style={styles.successMeta}>
            {selectedType} • {campaign?.title || 'General'}{frequency !== 'One-Time' ? ` • ${frequency}` : ''}
          </Text>
          <Text style={styles.successMsg}>May Allah accept your contribution and multiply your reward. Ameen.</Text>
          <TouchableOpacity style={styles.impactBtn} onPress={goImpact}>
            <Text style={styles.impactBtnText}>View My Impact →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeBtn} onPress={goHome}>
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : goHome()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Make Your Donation</Text>
          <Text style={styles.headerSub}>Empowering the Ummah, one life at a time.</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="share-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Selected Project */}
        {campaign && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>SELECTED PROJECT</Text>
            <View style={styles.projectRow}>
              <View style={[styles.projectDot, { backgroundColor: campaign.color || '#1B8A4C' }]} />
              <Text style={styles.projectName} numberOfLines={1}>{campaign.title}</Text>
              <Ionicons name="chevron-down" size={16} color="#aaa" />
            </View>
          </View>
        )}

        {/* Step pills */}
        <View style={styles.stepRow}>
          {['01 Amount', '02 Details', '03 Impact'].map((s, i) => (
            <View key={s} style={[styles.stepPill, i === 0 && styles.stepPillActive]}>
              <Text style={[styles.stepPillText, i === 0 && styles.stepPillTextActive]}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Donation Type */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>DONATION TYPE</Text>
          <View style={styles.typeGrid}>
            {DONATION_TYPES.map((t) => (
              <TouchableOpacity
                key={t.key}
                onPress={() => setSelectedType(t.key)}
                style={[styles.typeBtn, selectedType === t.key && styles.typeBtnActive]}
              >
                <FontAwesome5 name={t.icon} size={16} color={selectedType === t.key ? '#fff' : '#1B8A4C'} />
                <Text style={[styles.typeBtnText, selectedType === t.key && styles.typeBtnTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dedicate */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>DEDICATE THIS DONATION</Text>
          <View style={styles.dedicateRow}>
            {DEDICATE_OPTIONS.map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => setDedicate(d)}
                style={[styles.dedicateBtn, dedicate === d && styles.dedicateBtnActive]}
              >
                <Text style={[styles.dedicateBtnText, dedicate === d && styles.dedicateBtnTextActive]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Frequency */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>FREQUENCY</Text>
          <View style={styles.freqGrid}>
            {FREQUENCY_OPTIONS.map((f) => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFrequency(f.key)}
                style={[styles.freqBtn, frequency === f.key && styles.freqBtnActive]}
              >
                <Text style={[styles.freqBtnText, frequency === f.key && styles.freqBtnTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Choose Amount */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>CHOOSE AMOUNT</Text>
          <View style={styles.amountGrid}>
            {PRESET_AMOUNTS.map((amt) => {
              const isActive = selectedAmount === amt && !customAmount;
              return (
                <TouchableOpacity
                  key={amt}
                  onPress={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  style={[styles.amountBtn, isActive && styles.amountBtnActive]}
                >
                  <Text style={[styles.amountText, isActive && styles.amountTextActive]}>
                    ₹{amt.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.customLabel}>Enter Custom Amount (Min ₹ 50)</Text>
          <View style={styles.customInputBox}>
            <Text style={styles.rupeeSign}>₹</Text>
            <TextInput
              style={styles.customInput}
              placeholder={selectedAmount.toLocaleString()}
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={customAmount}
              onChangeText={(v) => { setCustomAmount(v); setSelectedAmount(0); }}
            />
          </View>
        </View>

        {/* Tax Benefit */}
        <View style={styles.card}>
          <View style={styles.taxRow}>
            <View style={styles.taxLeft}>
              <FontAwesome5 name="receipt" size={16} color="#F5A623" style={{ marginRight: 10 }} />
              <View>
                <Text style={styles.taxTitle}>TAX BENEFIT</Text>
                <Text style={styles.taxSub}>Generate Tax Certificate (80G)</Text>
              </View>
            </View>
            <Switch
              value={taxBenefit}
              onValueChange={setTaxBenefit}
              trackColor={{ false: '#ddd', true: '#1B8A4C' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Message */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>A MESSAGE OR DUA (OPTIONAL)</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Write your prayers or messages here..."
            placeholderTextColor="#bbb"
            multiline
            numberOfLines={3}
            value={message}
            onChangeText={setMessage}
          />
        </View>

        {/* Donation Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Donation Summary</Text>
          <View style={styles.summaryBox}>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLineLabel}>Donation Amount</Text>
              <Text style={styles.summaryLineValue}>₹{currentAmount.toLocaleString()}.00</Text>
            </View>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLineLabel}>Processing Fee</Text>
              <Text style={styles.summaryLineValue}>₹{processingFee}.00</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryLine}>
              <Text style={styles.summaryTotalLabel}>Total Contribution</Text>
              <Text style={styles.summaryTotalValue}>₹{totalContribution.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          style={[styles.proceedBtn, (processing || currentAmount < 50) && styles.proceedBtnDisabled]}
          onPress={handleProceed}
          disabled={processing || currentAmount < 50}
        >
          <Text style={styles.proceedBtnText}>
            {processing ? 'Processing...' : 'Proceed to Pay →'}
          </Text>
        </TouchableOpacity>

        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark-outline" size={14} color="#aaa" />
          <Text style={styles.secureText}>SECURE PAYMENT POWERED BY RAZORPAY</Text>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Success
  successBg: { flex: 1, backgroundColor: '#F0FFF4', alignItems: 'center', justifyContent: 'center', padding: 24 },
  successCard: { backgroundColor: '#fff', borderRadius: 24, padding: 28, alignItems: 'center', width: '100%', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 14, elevation: 6 },
  successEmoji: { fontSize: 52, marginBottom: 14 },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#1B8A4C', marginBottom: 10 },
  successSub: { fontSize: 13, color: '#888', marginBottom: 2 },
  successAmount: { fontSize: 38, fontWeight: '900', color: '#1A1A1A', marginBottom: 4 },
  successMeta: { fontSize: 13, color: '#888', marginBottom: 16 },
  successMsg: { fontSize: 13, color: '#555', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  impactBtn: { backgroundColor: '#1B8A4C', paddingVertical: 14, borderRadius: 13, alignItems: 'center', width: '100%', marginBottom: 10 },
  impactBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  homeBtn: { borderWidth: 1.5, borderColor: '#1B8A4C', paddingVertical: 13, borderRadius: 13, alignItems: 'center', width: '100%' },
  homeBtnText: { color: '#1B8A4C', fontWeight: '700', fontSize: 15 },

  // Form
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#1B8A4C' },
  backBtn: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 1 },
  headerIcon: { padding: 4 },

  stepRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  stepPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#E0E0E0' },
  stepPillActive: { backgroundColor: '#1B8A4C' },
  stepPillText: { fontSize: 12, fontWeight: '700', color: '#aaa' },
  stepPillTextActive: { color: '#fff' },

  card: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  cardLabel: { fontSize: 11, fontWeight: '700', color: '#999', letterSpacing: 0.8, marginBottom: 12 },

  projectRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, padding: 12, gap: 10 },
  projectDot: { width: 10, height: 10, borderRadius: 5 },
  projectName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1A1A1A' },

  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#E8F5E9', backgroundColor: '#F9FFF9' },
  typeBtnActive: { backgroundColor: '#1B8A4C', borderColor: '#1B8A4C' },
  typeBtnText: { fontSize: 13, color: '#1B8A4C', fontWeight: '600' },
  typeBtnTextActive: { color: '#fff' },

  dedicateRow: { flexDirection: 'row', gap: 8 },
  dedicateBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#E0E0E0', alignItems: 'center' },
  dedicateBtnActive: { borderColor: '#1B8A4C', backgroundColor: '#F0FFF4' },
  dedicateBtnText: { fontSize: 12, color: '#666', fontWeight: '500' },
  dedicateBtnTextActive: { color: '#1B8A4C', fontWeight: '700' },

  freqGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  freqBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#E0E0E0', backgroundColor: '#fff' },
  freqBtnActive: { backgroundColor: '#1B8A4C', borderColor: '#1B8A4C' },
  freqBtnText: { fontSize: 13, color: '#555', fontWeight: '600' },
  freqBtnTextActive: { color: '#fff', fontWeight: '700' },

  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  amountBtn: { width: '30%', paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#E0E0E0', alignItems: 'center', backgroundColor: '#fff' },
  amountBtnActive: { backgroundColor: '#1B8A4C', borderColor: '#1B8A4C' },
  amountText: { fontSize: 14, fontWeight: '700', color: '#444' },
  amountTextActive: { color: '#fff' },
  customLabel: { fontSize: 12, color: '#888', marginBottom: 8 },
  customInputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E8E8E8', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, backgroundColor: '#FAFAFA' },
  rupeeSign: { fontSize: 16, color: '#555', fontWeight: '700', marginRight: 6 },
  customInput: { flex: 1, fontSize: 16, color: '#222', fontWeight: '600' },

  taxRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  taxLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  taxTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  taxSub: { fontSize: 11, color: '#999', marginTop: 1 },

  messageInput: { borderWidth: 1.5, borderColor: '#E8E8E8', borderRadius: 12, padding: 14, fontSize: 14, color: '#333', minHeight: 80, textAlignVertical: 'top', backgroundColor: '#FAFAFA' },

  summaryCard: { marginHorizontal: 16, marginBottom: 12 },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 10 },
  summaryBox: { backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  summaryLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  summaryLineLabel: { fontSize: 14, color: '#666' },
  summaryLineValue: { fontSize: 14, color: '#333', fontWeight: '500' },
  summaryDivider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 10 },
  summaryTotalLabel: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  summaryTotalValue: { fontSize: 22, fontWeight: '900', color: '#1B8A4C' },

  proceedBtn: { marginHorizontal: 16, marginTop: 4, backgroundColor: '#1B8A4C', paddingVertical: 16, borderRadius: 14, alignItems: 'center', shadowColor: '#1B8A4C', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  proceedBtnDisabled: { opacity: 0.5 },
  proceedBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  secureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 10 },
  secureText: { fontSize: 10, color: '#aaa', fontWeight: '600', letterSpacing: 0.5 },
});